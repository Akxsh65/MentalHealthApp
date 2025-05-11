import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Assessment,
  TrendingUp,
  Book,
  Psychology,
  Download,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data
const moodData = [
  { date: "2024-03-01", value: 4 },
  { date: "2024-03-02", value: 3 },
  { date: "2024-03-03", value: 5 },
  { date: "2024-03-04", value: 4 },
  { date: "2024-03-05", value: 3 },
];

const journalStats = [
  { name: "Happy", value: 30 },
  { name: "Neutral", value: 45 },
  { name: "Sad", value: 25 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);

  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF report
    console.log("Downloading report...");
  };

  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom>
        Reports
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Available Reports
              </Typography>
              <List>
                <ListItem
                  button
                  onClick={() => handleReportSelect("mood")}
                  selected={selectedReport === "mood"}
                >
                  <ListItemIcon>
                    <TrendingUp />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mood Analysis"
                    secondary="View your mood trends and patterns"
                  />
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => handleReportSelect("journal")}
                  selected={selectedReport === "journal"}
                >
                  <ListItemIcon>
                    <Book />
                  </ListItemIcon>
                  <ListItemText
                    primary="Journal Insights"
                    secondary="Analysis of your journal entries"
                  />
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => handleReportSelect("overall")}
                  selected={selectedReport === "overall"}
                >
                  <ListItemIcon>
                    <Psychology />
                  </ListItemIcon>
                  <ListItemText
                    primary="Overall Progress"
                    secondary="Comprehensive mental health report"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5">
                  {selectedReport === "mood"
                    ? "Mood Analysis"
                    : selectedReport === "journal"
                    ? "Journal Insights"
                    : "Overall Progress"}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Download />}
                  onClick={handleDownloadReport}
                >
                  Download Report
                </Button>
              </Box>

              {selectedReport === "mood" && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Mood Trends
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              )}

              {selectedReport === "journal" && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Journal Entry Analysis
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={journalStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {journalStats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              )}

              {selectedReport === "overall" && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Overall Progress Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            Average Mood
                          </Typography>
                          <Typography variant="h4">3.8/5</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            Journal Entries
                          </Typography>
                          <Typography variant="h4">24</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            Meditation Sessions
                          </Typography>
                          <Typography variant="h4">12</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Reports; 