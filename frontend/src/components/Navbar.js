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
              { label: "ChatBot", to: "/chat" },
              { label: "Reports", to: "/reports" },
              { label: "Critical Action Plan", to: "/critical-action-plan" },
              { label: "Questionnaire", to: "/Questionnaire" }
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
            
            {/* Portal Buttons */}
            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
              <Button
                color="primary"
                variant="outlined"
                component={RouterLink}
                to="/patient-auth"
                sx={{ 
                  color: "#00372b", 
                  borderColor: "#00372b",
                  '&:hover': {
                    borderColor: "#00372b",
                    backgroundColor: "rgba(0, 55, 43, 0.04)"
                  }
                }}
              >
                Patient Portal
              </Button>
              <Button
                color="primary"
                variant="contained"
                component={RouterLink}
                to="/clinician/login"
                sx={{ 
                  backgroundColor: "#00372b",
                  '&:hover': {
                    backgroundColor: "#002a22"
                  }
                }}
              >
                Clinician Portal
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
