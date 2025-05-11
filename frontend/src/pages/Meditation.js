import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Slider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipNext,
  VolumeUp,
  Timer,
} from "@mui/icons-material";

const meditationSessions = [
  {
    id: 1,
    title: "Breathing Exercise",
    duration: "5 min",
    description: "A simple breathing exercise to help you relax",
  },
  {
    id: 2,
    title: "Body Scan",
    duration: "10 min",
    description: "Progressive body scan meditation",
  },
  {
    id: 3,
    title: "Mindful Walking",
    duration: "15 min",
    description: "Guided mindful walking meditation",
  },
];

function Meditation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [selectedSession, setSelectedSession] = useState(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setIsPlaying(false);
  };

  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom>
        Meditation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {selectedSession ? selectedSession.title : "Select a Session"}
              </Typography>
              {selectedSession && (
                <Box sx={{ textAlign: "center", my: 4 }}>
                  <Typography variant="h3" color="primary">
                    {selectedSession.duration}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {selectedSession.description}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <IconButton
                  color="primary"
                  size="large"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton color="primary" size="large">
                  <SkipNext />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <VolumeUp sx={{ mr: 2 }} />
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-labelledby="volume-slider"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Available Sessions
              </Typography>
              <List>
                {meditationSessions.map((session) => (
                  <ListItem
                    key={session.id}
                    button
                    onClick={() => handleSessionSelect(session)}
                    selected={selectedSession?.id === session.id}
                  >
                    <ListItemIcon>
                      <Timer />
                    </ListItemIcon>
                    <ListItemText
                      primary={session.title}
                      secondary={`${session.duration} • ${session.description}`}
                    />
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

export default Meditation; 