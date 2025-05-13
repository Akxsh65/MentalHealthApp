
---

## ✅ `README.md`

````markdown
# 🧠 Mental Health Chatbot (Text-Only, Gemini API + FastAPI + WebSocket)

This project is a real-time, text-based chatbot using Google's Gemini API. It is designed as a compassionate, emotionally supportive assistant accessible via a local FastAPI WebSocket server.

---

## ✨ Features

- Real-time **text conversation** with a Gemini-powered chatbot
- Emotionally intelligent **mental health assistant** persona
- Built with **FastAPI**, **WebSockets**, and **Python**
- Simple WebSocket-based API and CLI client
- Privacy-respecting: all data is processed locally (except Gemini API calls)

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mental-health-chatbot
cd mental-health-chatbot
````

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Add your Gemini API key

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

You can get an API key from [Google AI Studio](https://makersuite.google.com/app).

---

## ▶️ Run the WebSocket Server

Start the FastAPI server with:

```bash
uvicorn main:app --reload
```

Server will run at: `http://localhost:8000`

---

## 💬 Run the Chat Client (CLI)

Start the command-line chat client:

```bash
python client.py
```

### Example Interaction

```
Connected to ws://localhost:8000/ws/localvscodeclient
Sent configuration.
You (in VSCode): I'm feeling overwhelmed lately.
Assistant: I'm really sorry to hear that you're feeling overwhelmed. Would you like to talk more about what's been on your mind lately?
```

---

## 🧪 WebSocket Message Format

### Sent to Server:

```json
{
  "type": "text",
  "data": "I'm feeling anxious lately."
}
```

### Received from Server:

```json
{
  "type": "text",
  "text": "That sounds tough. Can you tell me more about what's been making you feel this way?"
}
```

---

## 🤖 Persona Configuration

The assistant is configured via a "system prompt" sent on connection:

> You are a compassionate and emotionally intelligent mental health assistant. Your goal is to help users talk through their feelings, understand their emotions, and feel heard without judgment...

(See `client.py` for full configuration.)

---

## 📦 File Structure

```
mental-health-chatbot/
├── main.py           # FastAPI server with Gemini WebSocket connection
├── voice-assistant.py         # CLI-based client that connects to the server
├── .env              # Contains GEMINI_API_KEY
├── requirements.txt  # Python dependencies
└── README.md
```
run the main.py using the command->uvicorn main:app --reload --host 0.0.0.0 --port 8000
---

## ⚠️ Disclaimer

This chatbot is **not a substitute for professional help**. It does **not diagnose**, treat, or provide medical advice. If you or someone you know is in crisis, contact a mental health professional or local helpline.

---

## 📄 License

MIT License – Free to use, modify, and share with attribution.

```

---

```
