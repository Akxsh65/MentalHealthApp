import React from "react";
import { Container, Grid, Box, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Box component="footer" sx={{ py: 6, bgcolor: "background.paper" }} mt={30}>
      <Container>
        <Grid container spacing={3}>
          {/* Logo & Tagline */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              MindfulMe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personal mental health companion
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink component={Link} to="/mood-tracker" color="text.secondary" underline="hover">
                • Mood Tracker
              </MuiLink>
              <MuiLink component={Link} to="/meditation" color="text.secondary" underline="hover">
                • Meditation
              </MuiLink>
              <MuiLink component={Link} to="/journal" color="text.secondary" underline="hover">
                • Journal
              </MuiLink>
              <MuiLink component={Link} to="/resources" color="text.secondary" underline="hover">
                • Resources
              </MuiLink>
            </Box>
          </Grid>

          {/* Contact Info */}
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

        {/* Footer Bottom Text */}
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
