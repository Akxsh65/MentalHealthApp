import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles"; 
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
} from "@mui/material";
import { Mic, Stop, Delete } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";

function Journal() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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

  const handleSaveEntry = () => {
    if (currentEntry.trim()) {
      const newEntry = {
        id: Date.now(),
        content: currentEntry,
        date: new Date().toLocaleDateString(),
      };
      setEntries([newEntry, ...entries]);

      // Simulate user message
      const userMessage = {
        text: currentEntry,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send to WebSocket
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: "text",
          data: currentEntry,
        }));
      } else {
        console.error("WebSocket is not open");
      }

      setCurrentEntry(""); // Clear entry
    }
  };


  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
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

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    console.log(isRecording ? "Stopped recording..." : "Started recording...");
  };

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Journal Entry Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h2" color="secondary" gutterBottom>
            Journal
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                New Entry
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="How are you feeling today?"
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSaveEntry}>
                  Save Entry
                </Button>
                <IconButton
                  color={isRecording ? "error" : "primary"}
                  onClick={toggleRecording}
                >
                  {isRecording ? <Stop /> : <Mic />}
                </IconButton>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Previous Entries
              </Typography>
              <List>
                {entries.map((entry) => (
                  <ListItem key={entry.id} divider>
                    <ListItemText primary={entry.content} secondary={entry.date} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteEntry(entry.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Chatbot Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h2" color="secondary" gutterBottom>
              Assistant
            </Typography>
            <Card sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              backgroundColor: "transparent",
              boxShadow: "none",
              borderRadius: "12px",  // Optional: Add a border radius if you want
            }}>
              <CardContent sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: 0,  // Remove internal padding
                backgroundColor: "transparent",  // Ensure CardContent itself is transparent
              }}>
                <div
                  ref={chatBoxRef}
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Translucent background
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
                        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                        marginBottom: "8px",
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
                            color: "#e2f3e2" // Or any other color you'd like
                          }}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  
                  {/* Input and send button section inside the transparent chat box */}
                  <div style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.3)", // Optional: Add a border between messages and input
                    paddingTop: "8px",
                  }}>
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
                          color: "#ffffff", // Text color
                          backgroundColor: "transparent", // Ensure the input is transparent as well
                          borderColor: "rgba(255, 255, 255, 0.3)", // Optional: Add a light border to the input
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Remove the default border of the text field
                        }
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSend}
                      disabled={!input.trim() || !isConnected}
                      sx={{ alignSelf: "flex-end", color : "#ffffff" }} // Ensure the icon color is white
                    >
                      <SendIcon />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

      </Grid>
    </Container>
  );
}

export default Journal;
