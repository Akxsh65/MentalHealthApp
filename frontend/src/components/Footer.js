import React from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

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
              • <Link to="/mood-tracker" style={{ textDecoration: "none", color: "inherit" }}>MoodTracker</Link>
              <br />
              • <Link to="/meditation" style={{ textDecoration: "none", color: "inherit" }}>Meditation</Link>
              <br />
             • <Link to="/journal" style={{ textDecoration: "none", color: "inherit" }}>Journal</Link>
              <br />
              • <Link to="/resources" style={{ textDecoration: "none", color: "inherit" }}>Resources</Link>
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
