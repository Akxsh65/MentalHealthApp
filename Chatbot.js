import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      const isNearBottom =
        chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 100;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const connectWebSocket = () => {
    const ws = new WebSocket("ws://localhost:8000/ws/webclient");
    websocketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket is open!");
      setIsConnected(true);
      const config = {
        type: "config",
        config: {
          systemPrompt:
            "You are a compassionate and emotionally intelligent mental health assistant. " +
            "Your goal is to help users talk through their feelings, understand their emotions, " +
            "and feel heard without judgment. Ask open-ended and gentle follow-up questions when appropriate, " +
            "encourage self-reflection, and validate the user's experience. Never diagnose or offer medical advice. " +
            "If a user expresses signs of crisis or self-harm, recommend speaking to a trusted person or contacting a local helpline. " +
            "Maintain a calm, kind, and supportive tone in every message.",
        },
      };
      ws.send(JSON.stringify(config));
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.type === "text" && response.text) {
          setMessages((prev) => [
            ...prev,
            {
              text: response.text,
              sender: "bot",
              timestamp: new Date().toISOString(),
            },
          ]);
        } else if (response.type === "error") {
          console.error("Server error:", response.message);
        }
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const handleSend = () => {
    if (input.trim() && isConnected) {
      const userMessage = {
        text: input,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      websocketRef.current?.send(
        JSON.stringify({ type: "text", data: input })
      );

      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container>
      <Typography variant="h2" color="secondary" gutterBottom>
        ChatBot
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: 0,
                backgroundColor: "transparent",
              }}
            >
              <div
                ref={chatBoxRef}
                style={{
                  height: "70vh",
                  overflowY: "auto", // Make it scrollable when content overflows
                  padding: "16px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Frosted glass background
                  backdropFilter: "blur(10px)", // Frosted glass effect
                  WebkitBackdropFilter: "blur(10px)", // Safari support
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent:
                        message.sender === "user" ? "flex-end" : "flex-start",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px",
                        maxWidth: "70%",
                        borderRadius: "8px",
                        backgroundColor: message.sender === "user" ? "transparent" : "#00372b",
                        color: "#e2f3e2",
                        boxShadow: message.sender === "user" ? "none" :"0 1px 3px rgba(0,0,0,0.1)"
                      }}
                    >
                      <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                        {message.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        style={{
                          display: "block",
                          marginTop: "4px",
                          textAlign: "right",
                          color: "#e2f3e2",
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "16px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.3)",
                  paddingTop: "8px",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={4}
                  sx={{
                    flex: 1,
                    ".MuiOutlinedInput-root": {
                      borderRadius: 2,
                      color: "#ffffff",
                      backgroundColor: "transparent",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim() || !isConnected}
                  sx={{ alignSelf: "flex-end", color: "#ffffff" }}
                >
                  <SendIcon />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Chatbot;
