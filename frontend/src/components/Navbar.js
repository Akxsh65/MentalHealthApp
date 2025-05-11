import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";

function Navbar() {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Mental Health App
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/mood-tracker"
            >
              Mood Tracker
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/meditation"
            >
              Meditation
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/journal"
            >
              Journal
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/chat"
            >
              Chat Support
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/reports"
            >
              Reports
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/trusted-contacts"
            >
              Trusted Contacts
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/clinician/login"
              sx={{ ml: 2 }}
            >
              Clinician Login
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 