import React, { useState, useRef, useEffect } from "react";
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
  LinearProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import { Mic, Stop, Delete, EmojiEvents } from "@mui/icons-material";

// Motivational quotes
const quotes = [
  "Every day is a fresh start.",
  "Small steps every day.",
  "Your feelings are valid.",
  "Progress, not perfection.",
  "You are stronger than you think.",
];

function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function Journal() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("journalEntries");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentEntry, setCurrentEntry] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("journalStreak");
    return saved ? JSON.parse(saved) : 0;
  });
  const [lastEntryDate, setLastEntryDate] = useState(() => {
    return localStorage.getItem("journalLastDate") || "";
  });
  const [quote, setQuote] = useState("");
  const recognitionRef = useRef(null);

  // Word count goal
  const WORD_GOAL = 50;
  const wordCount = currentEntry.trim().split(/\s+/).filter(Boolean).length;

  // Badges
  const badges = [];
  if (entries.length >= 1) badges.push("First Entry");
  if (streak >= 3) badges.push("3-Day Streak");
  if (streak >= 7) badges.push("7-Day Streak");
  if (entries.length >= 10) badges.push("10 Entries");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("journalStreak", JSON.stringify(streak));
    localStorage.setItem("journalLastDate", lastEntryDate);
  }, [streak, lastEntryDate]);

  const handleSaveEntry = () => {
    if (currentEntry.trim()) {
      const today = getToday();
      const newEntry = {
        id: Date.now(),
        content: currentEntry,
        date: new Date().toLocaleDateString(),
        isoDate: today,
      };
      setEntries([newEntry, ...entries]);
      setCurrentEntry("");

      // Streak logic
      if (lastEntryDate === "") {
        setStreak(1);
      } else {
        const prev = new Date(lastEntryDate);
        const curr = new Date(today);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        if (diff === 1) setStreak(streak + 1);
        else if (diff > 1) setStreak(1);
        // If same day, streak unchanged
      }
      setLastEntryDate(today);
    }
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const toggleRecording = () => {
    if (!isRecording) {
      if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        alert("Speech recognition not supported in this browser.");
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentEntry((prev) => prev ? prev + " " + transcript : transcript);
      };
      recognition.onerror = (event) => {
        alert("Speech recognition error: " + event.error);
        setIsRecording(false);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  return (
    <Container>
      <Typography variant="h2" color="secondary" gutterBottom>
        Journal
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="primary">
          {quote}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 2 }}>
                <Typography variant="h5" gutterBottom>
                  New Entry
                </Typography>
                {badges.map((badge) => (
                  <Tooltip key={badge} title={badge}>
                    <Chip
                      icon={<EmojiEvents color="warning" />}
                      label={badge}
                      color="warning"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Tooltip>
                ))}
              </Box>
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEntry}
                  disabled={!currentEntry.trim()}
                >
                  Save Entry
                </Button>
                <IconButton
                  color={isRecording ? "error" : "primary"}
                  onClick={toggleRecording}
                >
                  {isRecording ? <Stop /> : <Mic />}
                </IconButton>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Word count: {wordCount}/{WORD_GOAL}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((wordCount / WORD_GOAL) * 100, 100)}
                sx={{ height: 8, borderRadius: 2, mb: 1 }}
                color={wordCount >= WORD_GOAL ? "success" : "primary"}
              />
              <Typography variant="body2" color="text.secondary">
                {wordCount >= WORD_GOAL
                  ? "Great job! You've hit your daily word goal."
                  : `Write ${WORD_GOAL - wordCount} more words to reach your goal.`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Previous Entries
                </Typography>
                <Chip
                  label={`Streak: ${streak} day${streak === 1 ? "" : "s"}`}
                  color={streak >= 3 ? "success" : "primary"}
                  size="small"
                />
              </Box>
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
                {entries.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No entries yet. Start journaling today!
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Journal;
