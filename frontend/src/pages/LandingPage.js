import React from "react";
import { Container, Box, Typography, Paper, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

function LandingPage() {
  const theme = useTheme(); // Use theme to access colors and styles

  // Define features
  const features = [
    {
      title: "Mood Tracking",
      description:
        "Track your emotional patterns daily and gain insights into your mental well-being.",
    },
    {
      title: "Meditation",
      description:
        "Access guided meditations to help you manage stress, anxiety, and improve mindfulness.",
    },
    {
      title: "Journal",
      description:
        "Write down your thoughts and feelings in a private, secure space.",
    },
    {
      title: "Chat Support",
      description:
        "Get 24/7 support with our integrated chatbot for immediate mental health assistance.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Welcome Section */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h1" color="secondary" gutterBottom>
          Welcome to MindfulMe.
        </Typography>
        <Typography variant="h4" color="secondary">
          Your personal mental health companion
        </Typography>
        <Box mt={4}>
          <Button
            component={Link}
            to="/mood-tracker"
            variant="contained"
            color="primary"
            size="large"
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Scrollable Feature Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {features.map((feature, index) => (
          <Box
            key={feature.title}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: 3,
              p: 4,
            }}
          >
            {/* Description on Left */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" color="primary.main" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>

            {/* Card on Right */}
            <Paper
              elevation={4}
              sx={{
                flex: 1,
                height: 200,
                borderRadius: 4,
                backgroundColor: theme.palette.secondary.light,
              }}
            >
              {/* Placeholder content */}
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.text.secondary,
                }}
              >
                [Image / Chart / Component Placeholder]
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default LandingPage;
