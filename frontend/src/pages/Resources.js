import React, { useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";

function Resources() {
  const [showResources, setShowResources] = useState(false);

  const handleToggleResources = () => {
    setShowResources(!showResources);
  };

  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom>
        Resources
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleToggleResources}
        style={{ marginBottom: "20px" }}
      >
        {showResources ? "Hide Resources" : "Show Resources"}
      </Button>

      {showResources && (
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
                  • <a href="https://mind.plus/understanding-and-managing-anxiety-in-india-tips-and-techniques/" target="_blank" rel="noopener noreferrer">Understanding Anxiety</a>
                  <br />
                  • <a href="https://www.futurelearn.com/info/blog/what-is-anxiety" target="_blank" rel="noopener noreferrer">Understanding Anxiety</a>
                  <br />
                  • <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3852369/" target="_blank" rel="noopener noreferrer">Coping with Depression</a>
                  <br />
                  • <a href="https://www.helpguide.org/mental-health/depression/coping-with-depression" target="_blank" rel="noopener noreferrer">Coping with Depression</a>
                  <br />
                  • <a href="https://www.medicalnewstoday.com/articles/145855" target="_blank" rel="noopener noreferrer">Stress Management Tips</a>
                  <br />
                  • <a href="https://www.helpguide.org/mental-health/stress/stress-management" target="_blank" rel="noopener noreferrer">Stress Management Tips</a>
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
                  • <a href="https://www.therapyroute.com/therapists/india/india/1?gad_source=1&gad_campaignid=21894115654&gbraid=0AAAAADn3AFsZyF9lA39mckCHsyBDoxLdu&gclid=CjwKCAjw_pDBBhBMEiwAmY02NvokPU_uGE4-AMTbhh9QBz0e3pbpd-V4WX28TNeV1ayY-gbVDW-vnBoC1skQAvD_BwE" target="_blank" rel="noopener noreferrer">Find a Therapist</a>
                  <br />
                  • <a href="https://www.amahahealth.com/therapy-psychiatry/lpexpt/2b3/?utm_term=online%20counselling&utm_campaign=sm_amaha_all_therapy&utm_source=google&utm_medium=cpc&utm_content=all_therapy_adgroup_2b3&campaignid=17997518566&adgroupid=165913173505&adid=719022856785&gad_source=1&gad_campaignid=17997518566&gbraid=0AAAAADQ2m-K_40hPRaV9try3DOinCF-_n&gclid=CjwKCAjw_pDBBhBMEiwAmY02NkCjg_lp_88ruCuLF6F66dacLgi5LWiZJaM3VT1dusFggR41Wtkd_BoCaYcQAvD_BwE" target="_blank" rel="noopener noreferrer">Online Counseling</a>
                  <br />
                  • <a href="https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/support-groups/art-20044655" target="_blank" rel="noopener noreferrer">Support Groups</a>
                </Typography>
                <Button variant="outlined" color="primary">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Resources;
