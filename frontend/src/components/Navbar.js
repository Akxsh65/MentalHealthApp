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
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        borderRadius: 2,
        m: "10px",
        width: "calc(100% - 20px)",
        bgcolor: "background.paper",

      }}
    >
      <Container disableGutters>
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontSize: "1.5rem",
              textDecoration: "none",
              color: "#00372b",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            MindfulMe
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {[
              { label: "Mood Tracker", to: "/mood-tracker" },
              { label: "Meditation", to: "/meditation" },
              { label: "Journal", to: "/journal" },
              { label: "Chat Support", to: "/chat" },
              { label: "Reports", to: "/reports" },
              { label: "Trusted Contacts", to: "/trusted-contacts" },
              { label: "Clinician Login", to: "/clinician/login", ml: 2 },
            ].map(({ label, to, ml = 0 }) => (
              <Button
                key={label}
                color="inherit"
                component={RouterLink}
                to={to}
                sx={{ color: "#00372b", ml }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
