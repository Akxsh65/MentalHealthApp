import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import apiService from "../services/api";

function PatientAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    emergencyContact: "",
    email: "",
    password: "",
    consentShareChatbot: false,
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use real API service
      const response = await apiService.login(loginData.email, loginData.password);
      
      if (response.user_type === "patient") {
        // Store patient info
        localStorage.setItem("patient", JSON.stringify({
          id: response.user_id,
          email: loginData.email,
          user_type: "patient"
        }));
        
        navigate("/mood-tracker");
      } else {
        throw new Error("This account is not registered as a patient");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use real API service
      const userData = {
        email: registerData.email,
        password: registerData.password,
        user_type: "patient"
      };

      const patientData = {
        first_name: registerData.firstName,
        last_name: registerData.lastName,
        date_of_birth: registerData.dateOfBirth,
        phone: registerData.phone,
        emergency_contact: registerData.emergencyContact,
        consent_share_chatbot: registerData.consentShareChatbot
      };

      const response = await apiService.registerPatient(userData, patientData);
      
      // Store patient info
      localStorage.setItem("patient", JSON.stringify({
        id: response.user_id,
        email: registerData.email,
        user_type: "patient"
      }));

      navigate("/mood-tracker");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Patient Portal
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Access your mental health dashboard
                </Typography>
              </Box>

              <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {activeTab === 0 ? (
                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3 }}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={registerData.dateOfBirth}
                    onChange={handleRegisterChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={registerData.emergencyContact}
                    onChange={handleRegisterChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3 }}
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PatientAuth;
