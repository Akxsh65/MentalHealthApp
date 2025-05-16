import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Star } from "@mui/icons-material";

const meditationSessions = [
  {
    id: 1,
    title: "Breathing Exercise",
    duration: "5 min",
    description: "A simple breathing exercise to help you relax",
    type: "youtube",
    video: "https://www.youtube.com/embed/enJyOTvEn4M",
  },
  {
    id: 2,
    title: "Soothing your mind",
    duration: "10 min",
    description: "Cleanse your mind with this serene video music",
    type: "youtube",
    video: "https://www.youtube.com/embed/koRbYQyPU0U",
  },
  {
    id: 3,
    title: "Mindful Walking",
    duration: "15 min",
    description: "Guided mindful walking meditation",
    type: "youtube",
    video: "https://www.youtube.com/embed/sWrgKDzM0LU",
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

function MeditationVideo({ session }) {
  if (!session) return null;
  return (
    <iframe
      width="100%"
      height="400"
      src={session.video}
      title={session.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ marginTop: "16px", borderRadius: "8px" }}
    />
  );
}

const BubblePopper = () => {
  const [bubbles, setBubbles] = useState([]);
  const [popScore, setPopScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const left = Math.random() * 90;
      const size = 20 + Math.random() * 30;
      setBubbles((prev) => [...prev, { id, left, size }]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const popBubble = (id) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setPopScore((prev) => prev + 1);
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: 240,
        backgroundColor: "transparent",
        borderRadius: 2,
        overflow: "hidden",
        textAlign: "center",
        px: 2,
        py: 1,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Pop the bubbles to relax!
      </Typography>
      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
        Popped: {popScore}
      </Typography>

      {bubbles.map((bubble) => (
        <Box
          key={bubble.id}
          onClick={() => popBubble(bubble.id)}
          sx={{
            position: "absolute",
            bottom: 0,
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
            backgroundColor: "#7ab48e",
            borderRadius: "50%",
            cursor: "pointer",
            animation: "rise 4s linear forwards",
            boxShadow: "0 0 10px rgba(0, 55, 43, 0.2)",
            transition: "transform 0.2s ease-out",
            "&:hover": {
              transform: "scale(1.2)",
            },
          }}
        />
      ))}

      <style>
        {`
          @keyframes rise {
            0% { bottom: 0; opacity: 1; }
            90% { opacity: 1; }
            100% { bottom: 100%; opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};




function Meditation() {
  const [selectedSession, setSelectedSession] = useState(meditationSessions[0]);
  const [score, setScore] = useState(0);

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
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
        {/* Left column: video */}
        <Grid item xs={12} md={8}>
          <Card sx={{height: "auto"}}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {selectedSession.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {selectedSession.duration} • {selectedSession.description}
              </Typography>
              <MeditationVideo session={selectedSession} />
            </CardContent>
          </Card>
        </Grid>

        {/* Right column: session list */}
        <Grid item xs={12} md={4}>
          <Card sx={{height: "auto", overflowY: "auto" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Available Sessions
              </Typography>
              <List>
                {meditationSessions.map((session) => {
                  const videoId = session.video.split("/embed/")[1];
                  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                  return (
                    <ListItem
                      key={session.id}
                      button
                      selected={selectedSession.id === session.id}
                      onClick={() => handleSessionSelect(session)}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        backgroundImage: `url(${thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "white",
                        height: 100,
                        position: "relative",
                        "&.Mui-selected, &:hover": {
                          boxShadow: "0 0 12px 4px rgba(255,255,255,0.8)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(0,0,0,0.5)",
                          borderRadius: 2,
                        }}
                      />
                      <ListItemText
                        primary={
                        <>
                          <Typography component="span" variant="body1" sx={{ color: "#e2f3e2", fontWeight: "bold" }}>
                            {session.title}
                          </Typography>
                        </>
                        }
                        secondary={
                        <>
                          <Typography component="span" variant="body2" sx={{ color: "#e2f3e2", fontWeight: "bold" }}>
                            {session.duration} {" • "}
                          </Typography>
                          <Typography component="span" variant="body2" sx={{ color: "#e2f3e2" }}>
                            {session.description}
                          </Typography>
                        </>
                        }
                        sx={{ position: "relative", zIndex: 1 }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Game section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Relaxation Games
              </Typography>
              <Grid container spacing={3}>
                {/* Star Clicker Game */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Click the star to earn relaxation points!
                    </Typography>
                    <IconButton color="primary" size="large" onClick={handleGameClick}>
                      <Star fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      Score: {score}
                    </Typography>
                  </Box>
                </Grid>

                {/* Bubble Popper Game */}
                <Grid item xs={12} md={6}>
                  <BubblePopper />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Container>
  );
}

export default Meditation;
