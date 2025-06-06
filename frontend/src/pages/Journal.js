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
  Select,
  MenuItem
} from "@mui/material";
import { Mic, Stop, Delete, EmojiEvents, Attachment } from "@mui/icons-material";

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

  // === Entry selection for notebook-style viewer ===

  // State to hold the ID of the selected journal entry
  const [selectedEntryId, setSelectedEntryId] = useState(() => {
    const today = getToday();
    const todayEntry = entries.find((e) => e.isoDate === today);
    return todayEntry ? todayEntry.id : entries[0]?.id || null;
  });

  // Find the selected entry object from the entries list
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId);

  // Optional: Update selected entry when a new one is added (keeps today’s entry active)
  useEffect(() => {
    const today = getToday();
    const todayEntry = entries.find((e) => e.isoDate === today);
    if (todayEntry) {
      setSelectedEntryId(todayEntry.id);
    }
  }, [entries]);


  const handleSaveEntry = () => {
    if (currentEntry.trim()) {
      const today = getToday();
      const newEntry = {
        id: Date.now(),
        content: currentEntry,
        date: new Date().toLocaleDateString(),
        isoDate: today,
        timestamp: new Date().toLocaleTimeString(), // <-- Add timestamp here
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
        <Typography variant="subtitle1" color="secondary">
          {quote}
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        {/* New Entry Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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

        {/* Notebook-style Previous Entries Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: 400,
              backgroundColor: "secondary",
              color: "#00372b",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#e2f3e2",
              }}
            >
              {/* Date + Streak Chip container */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle2" color="#00372b">
                  {selectedEntry?.date || "No entry selected"}
                </Typography>
                <Chip
                  label={`Streak: ${streak || 0}`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>

              {/* Dropdown for selecting entry */}
              <Select
                size="small"
                value={selectedEntryId || ""}
                onChange={(e) => setSelectedEntryId(Number(e.target.value))}
                displayEmpty
                sx={{ minWidth: 150, color: "#00372b" }}
                MenuProps={{
                  disablePortal: true,
                  PaperProps: {
                    sx: { bgcolor: "#e2f3e2", color: "#00372b" },
                  },
                }}
              >
                {entries.map((entry) => (
                  <MenuItem
                    key={entry.id}
                    value={entry.id}
                    sx={{ color: "#00372b", display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{entry.date}</span>
                    <span style={{ fontSize: '0.8em', opacity: 0.7, marginLeft: '10px' }}>
                      {entry.timestamp || new Date(entry.id).toLocaleTimeString()}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </Box>


            <Box
              sx={{
              flexGrow: 1,
              overflowY: "auto",     // scroll vertically
              overflowX: "hidden",   // prevent horizontal scroll
              padding: 3,
              fontFamily: "'Courier New', monospace",
              lineHeight: "24px",
              whiteSpace: "pre-wrap",  // allow line breaks and wrapping
              wordWrap: "break-word",  // break long words
              wordBreak: "break-word", // break long words if needed
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                #b2c0b2 0px,
                #b2c0b2 1px,
                transparent 1px,
                transparent 24px
              )`,
              backgroundSize: "100% 24px",
              backgroundAttachment: "local",
              color: "#00372b",
            }}
          >

              <Typography variant="body1" color="#00372b">
                {selectedEntry?.content || "No entry available for this day."}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

    </Container>
  );
}

export default Journal;
