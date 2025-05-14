import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import './App.css';

// Pages
import LandingPage from "./pages/LandingPage";
import MoodTracker from "./pages/MoodTracker";
import Meditation from "./pages/Meditation";
import Journal from "./pages/Journal";
import Resources from "./pages/Resources";
import Chatbot from "./pages/Chatbot";
import Reports from "./pages/Reports";
import CriticalActionPlan from "./pages/CriticalActionPlan";
import ClinicianLogin from "./pages/ClinicianLogin";
import ClinicianDashboard from "./pages/ClinicianDashboard";


// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Box } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Box sx = {{pt: '80px'}}>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/mood-tracker" element={<MoodTracker />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/critical-action-plan" element={<CriticalActionPlan />} />
            <Route path="/reports" element={<Reports />} />

            {/* Clinician Routes */}
            <Route path="/clinician/login" element={<ClinicianLogin />} />
            <Route
              path="/clinician/dashboard"
              element={
                <ProtectedRoute>
                  <ClinicianDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
