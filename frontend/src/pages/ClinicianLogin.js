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
import { supabase } from "../config/supabaseClient";

function ClinicianLogin() {
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
    specialization: "",
    email: "",
    password: "",
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("clinicians")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (profileError || !profile) {
          throw new Error("Unauthorized: Not a registered clinician");
        }

        localStorage.setItem("clinician", JSON.stringify(profile));
        navigate("/clinician/dashboard");
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
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        // Wait a moment for the user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sign in the user to get a fresh session
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: registerData.email,
          password: registerData.password,
        });

        if (signInError) throw signInError;

        if (signInData?.user) {
          // Now create the clinician profile
          const { error: profileError } = await supabase
            .from("clinicians")
            .insert([
              {
                user_id: signInData.user.id,
                first_name: registerData.firstName,
                last_name: registerData.lastName,
                specialization: registerData.specialization,
              },
            ]);

          if (profileError) {
            console.error("Profile creation error:", profileError);
            throw new Error("Failed to create clinician profile. Please try again.");
          }

          // Fetch the created profile
          const { data: profile, error: fetchError } = await supabase
            .from("clinicians")
            .select("*")
            .eq("user_id", signInData.user.id)
            .single();

          if (fetchError) {
            console.error("Profile fetch error:", fetchError);
            throw new Error("Failed to fetch clinician profile. Please try logging in.");
          }

          localStorage.setItem("clinician", JSON.stringify(profile));
          navigate("/clinician/dashboard");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
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
                  Clinician Portal
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Access your clinician dashboard
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
                    label="Specialization"
                    name="specialization"
                    value={registerData.specialization}
                    onChange={handleRegisterChange}
                    margin="normal"
                    required
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

export default ClinicianLogin; 