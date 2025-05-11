import React from "react";
import { Container, Grid, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <Container>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h2" color="primary" gutterBottom>
              Welcome to MindfulMe
            </Typography>
            <Typography variant="h4" color="text.secondary" paragraph>
              Your personal mental health companion
            </Typography>
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
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773"
            alt="Mental Health"
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default LandingPage; 