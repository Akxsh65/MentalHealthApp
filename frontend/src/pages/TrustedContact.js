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
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@mui/material";
import { Delete, Person } from "@mui/icons-material";

function TrustedContact() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    shareMood: false,
    shareJournal: false,
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setNewContact((prev) => ({
      ...prev,
      [name]: name === "shareMood" || name === "shareJournal" ? checked : value,
    }));
  };

  const handleAddContact = () => {
    if (newContact.name && (newContact.email || newContact.phone)) {
      setContacts([
        ...contacts,
        {
          id: Date.now(),
          ...newContact,
        },
      ]);
      setNewContact({
        name: "",
        email: "",
        phone: "",
        shareMood: false,
        shareJournal: false,
      });
    }
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <Container>
      <Typography variant="h2" color="primary" gutterBottom>
        Trusted Contacts
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add New Contact
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={newContact.name}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newContact.email}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newContact.shareMood}
                        onChange={handleInputChange}
                        name="shareMood"
                      />
                    }
                    label="Share Mood Reports"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newContact.shareJournal}
                        onChange={handleInputChange}
                        name="shareJournal"
                      />
                    }
                    label="Share Journal Entries"
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddContact}
                  disabled={!newContact.name || (!newContact.email && !newContact.phone)}
                  sx={{ mt: 2 }}
                >
                  Add Contact
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Your Trusted Contacts
              </Typography>
              {contacts.length === 0 ? (
                <Typography color="text.secondary" align="center">
                  No trusted contacts added yet
                </Typography>
              ) : (
                <List>
                  {contacts.map((contact, index) => (
                    <React.Fragment key={contact.id}>
                      <ListItem>
                        <ListItemText
                          primary={contact.name}
                          secondary={
                            <>
                              {contact.email && (
                                <Typography variant="body2" component="span">
                                  {contact.email}
                                  <br />
                                </Typography>
                              )}
                              {contact.phone && (
                                <Typography variant="body2" component="span">
                                  {contact.phone}
                                  <br />
                                </Typography>
                              )}
                              <Typography variant="body2" component="span">
                                {contact.shareMood && "• Shares Mood Reports"}
                                {contact.shareMood && contact.shareJournal && " • "}
                                {contact.shareJournal && "• Shares Journal Entries"}
                              </Typography>
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < contacts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default TrustedContact; 