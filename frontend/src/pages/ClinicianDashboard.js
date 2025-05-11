import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data
const patients = [
  {
    id: 1,
    name: "John Doe",
    lastActive: "2024-03-05",
    moodTrend: "Improving",
    journalCount: 15,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    lastActive: "2024-03-04",
    moodTrend: "Stable",
    journalCount: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastActive: "2024-03-03",
    moodTrend: "Declining",
    journalCount: 12,
    status: "Needs Attention",
  },
];

const moodData = [
  { date: "2024-03-01", mood: "Happy" },
  { date: "2024-03-02", mood: "Calm" },
  { date: "2024-03-03", mood: "Anxious" },
  { date: "2024-03-04", mood: "Happy" },
  { date: "2024-03-05", mood: "Sad" },
];

function ClinicianDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom>
        Clinician Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{ mb: 3 }}
              >
                <Tab label="Patient Overview" />
                <Tab label="Detailed Reports" />
              </Tabs>

              {selectedTab === 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Last Active</TableCell>
                        <TableCell>Mood Trend</TableCell>
                        <TableCell>Journal Entries</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow
                          key={patient.id}
                          onClick={() => handlePatientSelect(patient)}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell>{patient.name}</TableCell>
                          <TableCell>{patient.lastActive}</TableCell>
                          <TableCell>
                            <Chip
                              label={patient.moodTrend}
                              color={
                                patient.moodTrend === "Improving"
                                  ? "success"
                                  : patient.moodTrend === "Declining"
                                  ? "error"
                                  : "default"
                              }
                            />
                          </TableCell>
                          <TableCell>{patient.journalCount}</TableCell>
                          <TableCell>
                            <Chip
                              label={patient.status}
                              color={
                                patient.status === "Needs Attention"
                                  ? "error"
                                  : "success"
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box>
                  {selectedPatient ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="h5" gutterBottom>
                              Mood Trends for {selectedPatient.name}
                            </Typography>
                            <Box sx={{ height: 300 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={moodData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="mood"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Patient Summary
                            </Typography>
                            <Typography variant="body1" paragraph>
                              • Total Journal Entries: {selectedPatient.journalCount}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              • Mood Trend: {selectedPatient.moodTrend}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              • Last Active: {selectedPatient.lastActive}
                            </Typography>
                            <Typography variant="body1">
                              • Status: {selectedPatient.status}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography color="text.secondary" align="center">
                      Select a patient to view detailed reports
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ClinicianDashboard; 