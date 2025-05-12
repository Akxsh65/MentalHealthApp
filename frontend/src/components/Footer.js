import React from "react";
import { Container, Grid, Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box component="footer" sx={{ py: 6, bgcolor: "background.paper" }} mt={30}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              MindfulMe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personal mental health companion
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Mood Tracker
              <br />
              • Meditation
              <br />
              • Journal
              <br />
              • Resources
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@mindfulme.com
              <br />
              Phone: (555) 123-4567
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} MindfulMe. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 