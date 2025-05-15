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
  Star,
} from "@mui/icons-material";

const meditationSessions = [
  {
    id: 1,
    title: "Breathing Exercise",
    duration: "5 min",
    description: "A simple breathing exercise to help you relax",
    type: "youtube",
    video: "https://www.youtube.com/embed/enJyOTvEn4M", // Example 5-min guided breathing
  },
  {
    id: 2,
    title: "Soothing your mind",
    duration: "10 min",
    description: "Cleanse your mind with this serene video music",
    type: "youtube",
    video: "https://www.youtube.com/embed/koRbYQyPU0U", // 10-min soothing meditation
  },
  {
    id: 3,
    title: "Mindful Walking",
    duration: "15 min",
    description: "Guided mindful walking meditation",
    type: "youtube",
    video: "https://www.youtube.com/embed/sWrgKDzM0LU", // 15-min mindful walking
  },
  {
    id: 4,
    title: "YouTube Meditation",
    duration: "20 min",
    description: "Relax with this YouTube meditation session",
    type: "youtube",
    video: "https://www.youtube.com/embed/inpok4MKVLM",
  },
];

// Helper to render video or YouTube iframe
function MeditationVideo({ session }) {
  if (!session) return null;
  if (session.type === "youtube") {
    return (
      <iframe
        width="100%"
        height="360"
        src={session.video}
        title={session.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ marginTop: "16px" }}
      />
    );
  }
  return (
    <video
      src={session.video}
      controls
      style={{ width: "100%", marginTop: "16px" }}
    />
  );
}

function Meditation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [selectedSession, setSelectedSession] = useState(null);
  const [score, setScore] = useState(0);

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

  const handleGameClick = () => {
    setScore(score + 1);
  };

  return (
    <Container>
      <Typography variant="h2" color="secondary" gutterBottom>
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
                  {selectedSession.type === "youtube" ? (
                    <iframe
                      width="100%"
                      height="360"
                      src={selectedSession.video}
                      title={selectedSession.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ marginTop: "16px" }}
                    />
                  ) : (
                    <video
                      src={selectedSession.video}
                      controls
                      style={{ width: "100%", marginTop: "16px" }}
                    />
                  )}
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

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Relaxation Game
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Click the star to earn relaxation points!
              </Typography>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <IconButton
                  color="primary"
                  size="large"
                  onClick={handleGameClick}
                >
                  <Star />
                </IconButton>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  Score: {score}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Meditation;
