import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";

function ClinicianLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to authenticate
    console.log("Login attempt:", credentials);
  };

  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h3" color="primary">
                  Clinician Login
                </Typography>
                <Typography color="text.secondary">
                  Access your patient dashboard
                </Typography>
              </Box>

              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  margin="normal"
                  required
                />
                <Box sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Login
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ClinicianLogin; 