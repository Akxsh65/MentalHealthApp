import React, { useState } from "react";
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

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = {
        text: input,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      
      const botResponse = {
        text: "I'm here to listen and support you. How are you feeling today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      
      setMessages([...messages, userMessage, botResponse]);
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
      <Typography variant="h2" color="primary" gutterBottom>
        Chat Support
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
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
                      justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                      mb: 2,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: "70%",
                        backgroundColor: message.sender === "user" ? "#e3f2fd" : "#fff",
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
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
                  disabled={!input.trim()}
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