import os
import json
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

# Import our new modules
from database import create_tables
from routes import auth, patients, clinicians, chatbot

# Load .env for GEMINI_API_KEY
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI(
    title="Mental Health App API",
    description="Backend API for Mental Health Application",
    version="1.0.0"
)

# Allow CORS for localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all our API routes
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(clinicians.router)
app.include_router(chatbot.router)

# Startup event to create database tables
@app.on_event("startup")
async def startup_event():
    create_tables()
    print("✅ Database tables created successfully")

@app.get("/")
async def root():
    return {"message": "Mental Health App API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

@app.websocket("/ws/webclient")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("✅ WebSocket connection accepted.")

    # Initialize Gemini model with safety settings
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        safety_settings=[
            {"category": "HARM_CATEGORY_DANGEROUS", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_LOW_AND_ABOVE"},
        ]
    )

    chat_session = model.start_chat(history=[])
    system_prompt = ""

    try:
        while True:
            print("🔁 Waiting for message from client...")
            data = await websocket.receive_text()
            print(f"📩 Received raw data: {data}")

            message = json.loads(data)
            print(f"📦 Parsed message: {message}")

            if message["type"] == "config":
                system_prompt = message["config"]["systemPrompt"]
                print(f"⚙️ System prompt received: {system_prompt}")
                
                # ❌ FIX HERE — remove 'await'
                chat_session.send_message(system_prompt)
                continue

            if message["type"] == "text":
                user_input = message["data"]
                print(f"👤 User input: {user_input}")

                # ❗ DO NOT AWAIT THIS — it's synchronous
                response = chat_session.send_message(user_input)
                bot_reply = response.text.strip()
                print(f"🤖 Gemini response: {bot_reply}")

                await websocket.send_text(json.dumps({
                    "type": "text",
                    "text": bot_reply
                }))
                print("📤 Sent response to frontend.")

    except WebSocketDisconnect:
        print("⚠️ Client disconnected.")
    except Exception as e:
        print(f"❌ Exception occurred: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": str(e)
        }))
