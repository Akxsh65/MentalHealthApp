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

# Logging config
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load .env
load_dotenv()

app = FastAPI()
router = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

connections: Dict[str, 'GeminiConnection'] = {}

class GeminiConnection:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in env.")

        self.model = "gemini-2.0-flash-exp"
        self.uri = (
            "wss://generativelanguage.googleapis.com/ws/"
            "google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"
            f"?key={self.api_key}"
        )
        self.ws = None
        self.config = None

    def set_config(self, config):
        self.config = config

    async def connect(self):
        self.ws = await websockets.connect(
            self.uri, ping_interval=20, ping_timeout=20, close_timeout=20
        )

        gen_config = {"response_modalities": ["TEXT"]}
        if voice := self.config.get("voice"):
            gen_config["response_modalities"].append("AUDIO")
            gen_config["speech_config"] = {
                "voice_config": {"prebuilt_voice_config": {"voice_name": voice}}
            }

        setup_msg = {
            "setup": {
                "model": f"models/{self.model}",
                "generation_config": gen_config,
                "system_instruction": {
                    "parts": [{"text": self.config.get("systemPrompt", "")}]
                }
            }
        }

        await self.ws.send(json.dumps(setup_msg))
        await self.ws.recv()

    async def send(self, msg_type, data):
        if not self.ws:
            return

        msg = None
        if msg_type == "text":
            msg = {
                "client_content": {
                    "turns": [{"role": "user", "parts": [{"text": data}]}],
                    "turn_complete": True
                }
            }
        elif msg_type == "audio":
            msg = {
                "realtime_input": {
                    "media_chunks": [{"data": data, "mime_type": "audio/pcm"}]
                }
            }
        elif msg_type == "image":
            msg = {
                "realtime_input": {
                    "media_chunks": [{"data": data, "mime_type": "image/jpeg"}]
                }
            }

        if msg:
            await self.ws.send(json.dumps(msg))

    async def receive(self):
        if self.ws:
            return await self.ws.recv()
        return None

    async def close(self):
        if self.ws:
            await self.ws.close()
            self.ws = None

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    gemini = GeminiConnection()
    connections[client_id] = gemini

    try:
        config = await websocket.receive_json()
        if config.get("type") != "config":
            await websocket.close(code=1008, reason="First message must be config")
            return

        gemini.set_config(config["config"])
        await gemini.connect()

        recv_client = asyncio.create_task(receive_from_client(websocket, gemini))
        recv_gemini = asyncio.create_task(receive_from_gemini(websocket, gemini))

        await asyncio.gather(recv_client, recv_gemini)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await gemini.close()
        connections.pop(client_id, None)
        await websocket.close()

async def receive_from_client(websocket: WebSocket, gemini: GeminiConnection):
    try:
        while True:
            message = await websocket.receive()
            if message["type"] == "websocket.disconnect":
                break

            data = json.loads(message.get("text", "{}"))
            msg_type, content = data.get("type"), data.get("data")

            if msg_type in {"text", "audio", "image"}:
                await gemini.send(msg_type, content)
    except Exception as e:
        logger.error(f"receive_from_client error: {e}")

async def receive_from_gemini(websocket: WebSocket, gemini: GeminiConnection):
    try:
        while True:
            msg = await gemini.receive()
            if not msg:
                break

            response = json.loads(msg)
            content = response.get("serverContent", {}).get("modelTurn", {}).get("parts", [])
            for part in content:
                if "inlineData" in part:
                    await websocket.send_json({"type": "audio", "data": part["inlineData"]["data"]})
                elif "text" in part:
                    await websocket.send_json({"type": "text", "text": part["text"]})

            if response.get("serverContent", {}).get("turnComplete"):
                await websocket.send_json({"type": "turn_complete", "data": True})

            if "error" in response:
                await websocket.send_json({"type": "error", "message": response["error"].get("message", "")})
    except Exception as e:
        logger.error(f"receive_from_gemini error: {e}")

# Register router and root
app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Voice Service API running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
