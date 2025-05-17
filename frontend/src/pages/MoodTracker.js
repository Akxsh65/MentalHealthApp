import React, { useState, useMemo } from "react";
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
  Tooltip as MuiTooltip,
  Chip,
  Fade,
} from "@mui/material";
import {
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  Delete,
  EmojiEvents,
  Whatshot,
  Star,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mood emoji data
const moodEmojis = [
  { value: 5, icon: <SentimentVerySatisfied fontSize="large" />, label: "Very Happy" },
  { value: 4, icon: <SentimentSatisfied fontSize="large" />, label: "Happy" },
  { value: 3, icon: <SentimentNeutral fontSize="large" />, label: "Neutral" },
  { value: 2, icon: <SentimentDissatisfied fontSize="large" />, label: "Sad" },
  { value: 1, icon: <SentimentVeryDissatisfied fontSize="large" />, label: "Very Sad" },
];

// Helper to get date string (YYYY-MM-DD)
const getDateString = (date = new Date()) =>
  date.toISOString().split("T")[0];

// Calculate streak
function calculateStreak(moods) {
  if (!moods.length) return 0;
  const sorted = [...moods].sort((a, b) => new Date(b.dateObj) - new Date(a.dateObj));
  let streak = 1;
  let prev = new Date(sorted[0].dateObj);
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i].dateObj);
    const diff = (prev - curr) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      prev = curr;
    } else if (diff > 1) {
      break;
    }
  }
  // Check if today is included
  if (getDateString() !== getDateString(sorted[0].dateObj)) streak = 0;
  return streak;
}

// Badge logic
function getBadges(moods, streak) {
  const badges = [];
  if (moods.length >= 7)
    badges.push({ icon: <EmojiEvents color="warning" />, label: "7 Moods Logged" });
  if (streak >= 3)
    badges.push({ icon: <Whatshot color="error" />, label: "3-Day Streak" });
  if (streak >= 7)
    badges.push({ icon: <Star color="primary" />, label: "7-Day Streak" });
  return badges;
}

function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [animatingMood, setAnimatingMood] = useState(null);

  // Add dateObj for easier calculations
  const moodsWithDateObj = useMemo(
    () =>
      moods.map((m) => ({
        ...m,
        dateObj: new Date(m.dateISO),
      })),
    [moods]
  );

  const streak = useMemo(() => calculateStreak(moodsWithDateObj), [moodsWithDateObj]);
  const badges = useMemo(() => getBadges(moods, streak), [moods, streak]);
  const progress = Math.min((streak / 7) * 100, 100);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setAnimatingMood(mood.value);
    setTimeout(() => setAnimatingMood(null), 400);
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      const todayISO = getDateString();
      // Prevent duplicate mood for today
      if (moods.some((m) => m.dateISO === todayISO)) return;
      const newMood = {
        id: Date.now(),
        value: selectedMood.value,
        label: selectedMood.label,
        note,
        date: new Date().toLocaleDateString(),
        dateISO: todayISO,
      };
      setMoods([newMood, ...moods]);
      setSelectedMood(null);
      setNote("");
    }
  };

  const handleDeleteMood = (id) => {
    setMoods(moods.filter((mood) => mood.id !== id));
  };

  const moodData = moods
    .slice()
    .reverse()
    .map((mood) => ({
      date: mood.date,
      value: mood.value,
    }));

  return (
    <Container>
      <Typography variant="h2" color="secondary" gutterBottom align="left">
        Mood Tracker
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 6, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                How are you feeling today?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 3, my: 3 }}>
                {moodEmojis.map((mood) => (
                  <Box
                    key={mood.value}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.4s ease-in-out",
                      transform: selectedMood?.value === mood.value ? "scale(1.4)" : "scale(1)",
                      p: 0,
                    }}
                    onClick={() => handleMoodSelect(mood)}
                  >
                    <MuiTooltip title={mood.label} arrow>
                      <span>{mood.icon}</span>
                    </MuiTooltip>
                  </Box>
                ))}
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Add a note about your mood..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{
                  mb: 2,
                  backgroundColor: "secondary.main",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveMood}
                disabled={!selectedMood || moods.some((m) => m.dateISO === getDateString())}
                sx={{ fontWeight: 600, px: 4, py: 1.5, fontSize: "1.1rem" }}
              >
                Save Mood
              </Button>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <Whatshot color="error" sx={{ verticalAlign: "middle" }} /> Streak:{" "}
                  <b>{streak}</b> day{streak !== 1 ? "s" : ""}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "primary.main",
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {progress === 100
                    ? "Amazing! 7-day streak achieved!"
                    : `Keep going! ${7 - streak} day(s) to a 7-day streak.`}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  {badges.map((badge, idx) => (
                    <Chip
                      key={idx}
                      icon={badge.icon}
                      label={badge.label}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3, boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Mood History
              </Typography>
              <Box sx={{ height: 300, backgroundColor: "secondary", borderRadius: 2, p: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={moodData}
                    style={{ backgroundColor: "transparent" }} // ✅ make chart itself transparent
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="date" stroke="#00372b" />
                    <YAxis domain={[0, 5]} stroke="#00372b" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "transparent", border: "none" }}
                      labelStyle={{ color: "#00372b" }}
                      itemStyle={{ color: "#00372b" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00372b" // Or better: use theme.palette.primary.main
                      dot={{ fill: "#00372b" }}
                      activeDot={{ r: 8, fill: "#00372b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Moods
              </Typography>
              <List>
                {moods.map((mood) => (
                  <ListItem key={mood.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {moodEmojis.find((m) => m.value === mood.value)?.icon}
                          {mood.label}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {mood.date}
                          </Typography>
                          {mood.note}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteMood(mood.id)}
                        sx={{
                          color: "error.main",
                          "&:hover": { bgcolor: "error.light" },
                        }}
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

export default MoodTracker;
