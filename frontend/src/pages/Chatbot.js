import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  IconButton,
  Paper,
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
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
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

      if (messages.length === 0) {
        setMessages([
          {
            text: "I'm here to listen and support you. How are you feeling today?",
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("Received message:", response);

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
          console.error("Error from server:", response.message);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      setIsConnected(false);
      setTimeout(() => {
        console.log("Attempting to reconnect...");
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

      const message = {
        type: "text",
        data: input,
      };

      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        websocketRef.current.send(JSON.stringify(message));
      } else {
        console.error("WebSocket is not open");
      }

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
        Chat Support
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                ref={chatBoxRef}
                sx={{
                  height: "400px",
                  overflowY: "auto",
                  mb: 2,
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent:
                        message.sender === "user" ? "flex-end" : "flex-start",
                      mb: 2,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: "70%",
                        backgroundColor:
                          message.sender === "user" ? "#e3f2fd" : "#fff",
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={4}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim() || !isConnected}
                  sx={{ alignSelf: "flex-end" }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Chatbot;
