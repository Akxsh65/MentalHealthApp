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
import {
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  Delete,
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

const moodEmojis = [
  { value: 5, icon: <SentimentVerySatisfied />, label: "Very Happy" },
  { value: 4, icon: <SentimentSatisfied />, label: "Happy" },
  { value: 3, icon: <SentimentNeutral />, label: "Neutral" },
  { value: 2, icon: <SentimentDissatisfied />, label: "Sad" },
  { value: 1, icon: <SentimentVeryDissatisfied />, label: "Very Sad" },
];

function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      const newMood = {
        id: Date.now(),
        value: selectedMood.value,
        label: selectedMood.label,
        note,
        date: new Date().toLocaleDateString(),
      };
      setMoods([newMood, ...moods]);
      setSelectedMood(null);
      setNote("");
    }
  };

  const handleDeleteMood = (id) => {
    setMoods(moods.filter((mood) => mood.id !== id));
  };

  const moodData = moods.map((mood) => ({
    date: mood.date,
    value: mood.value,
  }));

  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom>
        Mood Tracker
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                How are you feeling today?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 3 }}>
                {moodEmojis.map((mood) => (
                  <IconButton
                    key={mood.value}
                    color={selectedMood?.value === mood.value ? "primary" : "default"}
                    onClick={() => handleMoodSelect(mood)}
                    sx={{ fontSize: "2rem" }}
                  >
                    {mood.icon}
                  </IconButton>
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
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveMood}
                disabled={!selectedMood}
              >
                Save Mood
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Mood History
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
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