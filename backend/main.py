import uvicorn
from fastapi import FastAPI, WebSocket, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import os
from dotenv import load_dotenv
import websockets
from typing import Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

app = FastAPI()
router = APIRouter()

# CORS middleware settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class GeminiConnection:
    def __init__(self):
        # Initialize API key and WebSocket URI
        self.api_key = os.environ.get('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")

        self.model = "gemini-2.0-flash-exp"
        self.uri = (
            "wss://generativelanguage.googleapis.com/ws/"
            "google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"
            f"?key={self.api_key}"
        )
        self.ws = None
        self.config = None
        logger.info(f"Initialized GeminiConnection with model: {self.model}")

    async def connect(self):
        try:
            logger.info(f"Attempting to connect to Gemini API...")
            
            # Connect without custom headers
            self.ws = await websockets.connect(
                self.uri,
                ping_interval=20,  # Keep connection alive
                ping_timeout=20,
                close_timeout=20
            )
            
            logger.info("Successfully connected to Gemini WebSocket")

            if not self.config:
                raise ValueError("Configuration must be set before connecting")

            generation_config = {
                "response_modalities": ["TEXT"]
            }

            voice = self.config.get("voice")
            if voice:
                generation_config["response_modalities"].append("AUDIO")
                generation_config["speech_config"] = {
                    "voice_config": {
                        "prebuilt_voice_config": {
                            "voice_name": voice
                        }
                    }
                }

            setup_message = {
                "setup": {
                    "model": f"models/{self.model}",
                    "generation_config": generation_config,
                    "system_instruction": {
                        "parts": [
                            {
                                "text": self.config["systemPrompt"]
                            }
                        ]
                    }
                }
            }

            logger.info("Sending setup message to Gemini")
            await self.ws.send(json.dumps(setup_message))
            
            setup_response = await self.ws.recv()
            logger.info("Received setup response from Gemini")
            return setup_response

        except websockets.exceptions.InvalidStatusCode as e:
            logger.error(f"WebSocket connection failed with status code {e.status_code}: {e}")
            raise
        except websockets.exceptions.InvalidMessage as e:
            logger.error(f"Invalid WebSocket message: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during connection: {str(e)}")
            raise

    def set_config(self, config):
        """Set configuration for the connection"""
        logger.info(f"Setting Gemini configuration: {json.dumps(config, indent=2)}")
        self.config = config

    async def send_audio(self, audio_data: str):
        """Send audio data to Gemini"""
        try:
            realtime_input_msg = {
                "realtime_input": {
                    "media_chunks": [
                        {
                            "data": audio_data,
                            "mime_type": "audio/pcm"
                        }
                    ]
                }
            }
            if self.ws:
                await self.ws.send(json.dumps(realtime_input_msg))
                logger.info("Audio data sent successfully")
        except Exception as e:
            logger.error(f"Error sending audio data: {str(e)}")
            raise

    async def receive(self):
        """Receive message from Gemini"""
        try:
            if self.ws:
                msg = await self.ws.recv()
                return msg
            return None
        except websockets.exceptions.ConnectionClosed as e:
            logger.error(f"Connection closed while receiving: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Error receiving message: {str(e)}")
            raise

    async def close(self):
        """Close the connection"""
        if self.ws:
            logger.info("Closing Gemini WebSocket connection")
            try:
                await self.ws.close()
            except Exception as e:
                logger.error(f"Error closing connection: {str(e)}")
            finally:
                self.ws = None

    async def send_image(self, image_data: str):
        """Send image data to Gemini"""
        try:
            logger.info("Sending image data to Gemini")
            image_message = {
                "realtime_input": {
                    "media_chunks": [
                        {
                            "data": image_data,
                            "mime_type": "image/jpeg"
                        }
                    ]
                }
            }
            if self.ws:
                await self.ws.send(json.dumps(image_message))
                logger.info("Image data sent successfully")
        except Exception as e:
            logger.error(f"Error sending image data: {str(e)}")
            raise

    async def send_text(self, text: str):
        """Send text message to Gemini"""
        try:
            logger.info(f"Sending text message to Gemini: {text[:100]}...")
            text_message = {
                "client_content": {
                    "turns": [
                        {
                            "role": "user",
                            "parts": [{"text": text}]
                        }
                    ],
                    "turn_complete": True
                }
            }
            if self.ws:
                await self.ws.send(json.dumps(text_message))
                logger.info("Text message sent successfully")
        except Exception as e:
            logger.error(f"Error sending text message: {str(e)}")
            raise

# Dictionary to keep track of connections
connections: Dict[str, GeminiConnection] = {}

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    try:
        await websocket.accept()
        logger.info(f"WebSocket connection accepted for client: {client_id}")

        gemini = None
        try:
            # Create a new Gemini connection
            gemini = GeminiConnection()
            connections[client_id] = gemini
            logger.info(f"Created GeminiConnection for {client_id}")

            # Receive and set configuration from the client
            config_data = await websocket.receive_json()
            logger.info(f"Received config from {client_id}")
            
            if config_data.get("type") != "config":
                error_msg = "First message must be configuration"
                logger.error(f"Invalid first message from {client_id}: {error_msg}")
                await websocket.close(code=1008, reason=error_msg)
                return

            gemini.set_config(config_data.get("config", {}))

            # Establish the connection to Gemini
            await gemini.connect()
            logger.info(f"Gemini connection established for {client_id}")

            # Run both receiving tasks concurrently
            await asyncio.gather(
                receive_from_client(websocket, gemini),
                receive_from_gemini(websocket, gemini)
            )

        except websockets.exceptions.ConnectionClosed as e:
            logger.error(f"WebSocket connection closed for client {client_id}: {str(e)}")
        except Exception as e:
            logger.error(f"Error in WebSocket connection for client {client_id}: {str(e)}")
            try:
                await websocket.close(code=1011, reason=f"Server error: {str(e)}")
            except:
                pass
        finally:
            # Clean up the connection
            logger.info(f"Cleaning up connection for client {client_id}")
            if client_id in connections:
                if connections[client_id].ws:
                    await connections[client_id].close()
                del connections[client_id]
                logger.info(f"Removed GeminiConnection for {client_id}")

    except Exception as e:
        logger.error(f"Fatal error in websocket_endpoint for client {client_id}: {str(e)}")
        try:
            await websocket.close(code=1011, reason=f"Fatal server error: {str(e)}")
        except:
            pass

async def receive_from_client(websocket: WebSocket, gemini: GeminiConnection):
    try:
        while True:
            if websocket.client_state.name == 'DISCONNECTED':
                logger.info("Client receive loop: WebSocket disconnected")
                break

            try:
                message = await websocket.receive()
                if message["type"] == "websocket.disconnect":
                    logger.info(f"Client {websocket.path_params['client_id']} disconnected")
                    break

                if "text" in message:
                    message_content = json.loads(message["text"])
                    msg_type = message_content.get("type")
                    msg_data = message_content.get("data")

                    if not msg_type or msg_data is None:
                        logger.warning(f"Received invalid message structure: {message_content}")
                        continue

                    logger.info(f"Processing message of type: {msg_type}")
                    if msg_type == "audio":
                        await gemini.send_audio(msg_data)
                    elif msg_type == "image":
                        await gemini.send_image(msg_data)
                    elif msg_type == "text":
                        await gemini.send_text(msg_data)
                    else:
                        logger.warning(f"Unknown message type: {msg_type}")
                elif "bytes" in message:
                    logger.warning("Received binary message, not handled")

            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {e} - Message: {message.get('text', 'N/A')}")
                continue
            except KeyError as e:
                logger.error(f"Key error in message: {e} - Message: {message.get('text', 'N/A')}")
                continue
            except websockets.exceptions.ConnectionClosedOK:
                logger.info("Client receive loop: Connection closed normally")
                break
            except websockets.exceptions.ConnectionClosedError as e:
                logger.error(f"Client receive loop: Connection closed with error: {e}")
                break
            except Exception as e:
                logger.error(f"Error processing client message: {str(e)} - Message: {message}")
                continue

    except Exception as e:
        logger.error(f"Fatal error in receive_from_client: {str(e)}")
    finally:
        logger.info("Exiting receive_from_client loop")

async def receive_from_gemini(websocket: WebSocket, gemini: GeminiConnection):
    try:
        while True:
            if websocket.client_state.name == 'DISCONNECTED':
                logger.info("Gemini receive loop: WebSocket disconnected")
                break

            msg = await gemini.receive()
            if msg is None:
                logger.info("Gemini receive loop: Gemini connection closed")
                break

            response = json.loads(msg)
            response_to_client = {"type": "unknown"}

            server_content = response.get("serverContent", {})
            model_turn = server_content.get("modelTurn", {})
            parts = model_turn.get("parts", [])

            processed_part = False
            for p in parts:
                if websocket.client_state.name == 'DISCONNECTED':
                    logger.info("Gemini receive loop: Client disconnected before sending")
                    return

                if "inlineData" in p:
                    audio_data = p["inlineData"].get("data")
                    if audio_data:
                        response_to_client = {"type": "audio", "data": audio_data}
                        await websocket.send_json(response_to_client)
                        processed_part = True
                elif "text" in p:
                    text_data = p.get("text")
                    if text_data:
                        logger.info(f"Received text from Gemini: {text_data[:100]}...")
                        response_to_client = {"type": "text", "text": text_data}
                        await websocket.send_json(response_to_client)
                        processed_part = True

            if server_content.get("turnComplete"):
                if websocket.client_state.name != 'DISCONNECTED':
                    await websocket.send_json({"type": "turn_complete", "data": True})

            if "error" in response:
                error_details = response["error"].get("message", "Unknown Gemini error")
                logger.error(f"Error from Gemini API: {error_details}")
                if websocket.client_state.name != 'DISCONNECTED':
                    await websocket.send_json({"type": "error", "message": error_details})

    except json.JSONDecodeError as e:
        logger.error(f"Gemini receive loop: JSON decode error: {e} - Message: {msg}")
    except websockets.exceptions.ConnectionClosedOK:
        logger.info("Gemini receive loop: Connection closed normally")
    except websockets.exceptions.ConnectionClosedError as e:
        logger.error(f"Gemini receive loop: Connection closed with error: {e}")
    except Exception as e:
        logger.error(f"Error receiving from Gemini or sending to client: {e}")
        try:
            if websocket.client_state.name != 'DISCONNECTED':
                await websocket.send_json({"type": "error", "message": f"Server error during Gemini communication: {e}"})
        except Exception as inner_e:
            logger.error(f"Could not send error to client: {inner_e}")

    finally:
        logger.info("Exiting receive_from_gemini loop")

# Adding the router to the app
app.include_router(router)

# Default route for testing
@app.get("/")
async def root():
    return {"message": "Voice Service API is running"}

# Run the app with uvicorn if executed directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000,debug=True, reload=True)
