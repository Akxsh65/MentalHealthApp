import React from "react";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";

function Resources() {
  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom>
        Resources
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Crisis Hotlines
              </Typography>
              <Typography variant="body1" paragraph>
                • National Suicide Prevention Lifeline: 988
                <br />
                • Crisis Text Line: Text HOME to 741741
                <br />
                • Emergency Services: 911
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Mental Health Articles
              </Typography>
              <Typography variant="body1" paragraph>
                • Understanding Anxiety
                <br />
                • Coping with Depression
                <br />
                • Stress Management Tips
              </Typography>
              <Button variant="outlined" color="primary">
                Read More
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Professional Help
              </Typography>
              <Typography variant="body1" paragraph>
                • Find a Therapist
                <br />
                • Online Counseling
                <br />
                • Support Groups
              </Typography>
              <Button variant="outlined" color="primary">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Resources; 