import asyncio
import websockets
import json

async def connect_mental_health_chatbot():
    try:
        # Updated to connect to localhost WebSocket server
        uri = "ws://localhost:8000/ws/localvscodeclient"  # Change this line

        async with websockets.connect(uri) as websocket:
            print(f"Connected to {uri}")

            # 1. Send Configuration (Mental Health Chatbot Setup)
            config = {
                "type": "config",
                "config": {
                    "systemPrompt": (
                        "You are a compassionate and emotionally intelligent mental health assistant. "
                        "Your goal is to help users talk through their feelings, understand their emotions, "
                        "and feel heard without judgment. Ask open-ended and gentle follow-up questions when appropriate, "
                        "encourage self-reflection, and validate the user's experience. Never diagnose or offer medical advice. "
                        "If a user expresses signs of crisis or self-harm, recommend speaking to a trusted person or contacting a local helpline. "
                        "Maintain a calm, kind, and supportive tone in every message."
                    )
                }
            }
            await websocket.send(json.dumps(config))
            print("Sent configuration.")

            # 2. Send user text input
            async def send_user_input():
                while True:
                    user_text = input("You (in VSCode): ")
                    if not user_text:
                        break
                    message = {"type": "text", "data": user_text}
                    await websocket.send(json.dumps(message))

            # 3. Receive and print responses
            async def receive_responses():
                async for message in websocket:
                    try:
                        response = json.loads(message)
                        if response.get("type") == "text" and response.get("text"):
                            print(f"Assistant: {response['text']}")
                        elif response.get("type") == "turn_complete":
                            print("Assistant turn complete.")
                        elif response.get("type") == "error" and response.get("message"):
                            print(f"Error: {response['message']}")
                    except json.JSONDecodeError:
                        print(f"Received non-JSON message: {message}")
                    except Exception as e:
                        print(f"Error processing message: {e}")

            # 4. Handle Audio Input
            async def send_audio_input():
                while True:
                    audio_file = input("Enter path to audio file (or type 'exit' to quit): ")
                    if audio_file.lower() == "exit":
                        break
                    import base64
                    
                    with open(audio_file, "rb") as f:
                        audio_data = f.read()
                        encoded_audio = base64.b64encode(audio_data).decode("utf-8")
                        message = {"type": "audio", "data": encoded_audio}
                        await websocket.send(json.dumps(message))
            
            # Run sending and receiving concurrently
            user_input_task = asyncio.create_task(send_user_input())
            audio_input_task = asyncio.create_task(send_audio_input())
            try:
                receive_responses_task = asyncio.create_task(receive_responses())
                await asyncio.gather(receive_responses_task, return_exceptions=True)
            finally:
                user_input_task.cancel()
                audio_input_task.cancel()
                await asyncio.gather(user_input_task, audio_input_task, return_exceptions=True)

    except websockets.exceptions.ConnectionClosedError as e:
        print(f"Connection closed unexpectedly: {e}")
    except ConnectionRefusedError:
        print("Connection refused. Ensure the server is running and the local WebSocket is accessible.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'websocket' in locals() and websocket.open:
            await websocket.close()
        print("Connection closed.")

if __name__ == "__main__":
    asyncio.run(connect_mental_health_chatbot())
    print("Client started. Look for 'You (in VSCode):' prompt.")
