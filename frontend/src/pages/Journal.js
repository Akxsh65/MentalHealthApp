import React, { useState } from "react";
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
} from "@mui/material";
import { Mic, Stop, Delete } from "@mui/icons-material";

function Journal() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSaveEntry = () => {
    if (currentEntry.trim()) {
      const newEntry = {
        id: Date.now(),
        content: currentEntry,
        date: new Date().toLocaleDateString(),
      };
      setEntries([newEntry, ...entries]);
      setCurrentEntry("");
    }
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would integrate with the Web Speech API
    if (!isRecording) {
      console.log("Started recording...");
    } else {
      console.log("Stopped recording...");
    }
  };

  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom>
        Journal
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEntry}
                >
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
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Previous Entries
              </Typography>
              <List>
                {entries.map((entry) => (
                  <ListItem key={entry.id} divider>
                    <ListItemText
                      primary={entry.content}
                      secondary={entry.date}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Journal; 