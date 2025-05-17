import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function LandingPage() {
  const features = [
    {
      title: "Mood Tracking",
      description:
        "Track your emotional patterns daily and gain insights into your mental well-being.",
      image: "/mood_tracker_page.png",
    },
    {
      title: "Meditation",
      description:
        "Access guided meditations to help you manage stress, anxiety, and improve mindfulness.",
      image: "/meditation_page.png",
    },
    {
      title: "Journal",
      description:
        "Write down your thoughts and feelings in a private, secure space.",
      image: "/journal_page.png",
    },
    {
      title: "ChatBot",
      description:
        "Get 24/7 support with our integrated chatbot for immediate mental health assistance.",
      image: "/chatbot_page.png",
    },
    {
      title: "Critical Action Plan",
      description:
        "Create a personalized emergency reference list for when you feel overwhelmed or are spiraling.",
      image: "/critical_action_plan_page.png",
    },
    {
      title: "Well-being Questionnaire",
      description:
        "Answer guided questions to receive a well-being score and personalized recommendations.",
      image: "/questionnaire_page.png",
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

      {/* Feature Cards */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {features.map((feature) => (
          <Box
            key={feature.title}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "stretch",
              backgroundColor: "#e2f3e2",
              borderRadius: 8,
              boxShadow: 3,
              overflow: "hidden",
            }}
          >
            {/* Text */}
            <Box
              sx={{
                flex: 1,
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" color="primary.main" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>

            {/* Image */}
            <Box
              sx={{
                flex: 1,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                    margin: "5px",
                    borderBottomRightRadius: "28px",
                    borderTopRightRadius: "28px",
                  }}
                >
                  <img
                    src={feature.image}
                    alt={`${feature.title} Screenshot`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(to right, #e2f3e2 0%, transparent 50%)`,
                      pointerEvents: "none",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default LandingPage;
