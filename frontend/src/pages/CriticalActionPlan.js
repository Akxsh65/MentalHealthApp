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
import { Delete } from "@mui/icons-material";

function CriticalActionPlan() {
  const [situation, setSituation] = useState({
    title: "",
    description: "",
  });

  const [selfMessages, setSelfMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [feelGoodActions, setFeelGoodActions] = useState([]);
  const [newAction, setNewAction] = useState("");

  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    problemType: "",
    shareMood: false,
    shareJournal: false,
  });

  const handleSituationChange = (e) => {
    const { name, value } = e.target;
    setSituation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      setSelfMessages([
        { id: Date.now(), text: newMessage.trim() },
        ...selfMessages,
      ]);
      setNewMessage("");
    }
  };

  const handleAddAction = () => {
    if (newAction.trim()) {
      setFeelGoodActions([...feelGoodActions, newAction.trim()]);
      setNewAction("");
    }
  };

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
        { id: Date.now(), ...newContact },
      ]);
      setNewContact({
        name: "",
        email: "",
        phone: "",
        problemType: "",
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
      <Typography variant="h3" color="secondary" gutterBottom>
        Critical Action Plan
      </Typography>

      {/* Situation Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5">Situation or Problem</Typography>
          <TextField
            fullWidth
            label="Situation Title (e.g., Anxiety Episode)"
            name="title"
            value={situation.title}
            onChange={handleSituationChange}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Describe when this situation happens or what it feels like"
            name="description"
            value={situation.description}
            onChange={handleSituationChange}
            margin="normal"
          />
        </CardContent>
      </Card>

      {/* Message to Myself */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5">Message to Myself</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Write something reassuring for your future self"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddMessage}>
            Save Message
          </Button>

          {selfMessages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {selfMessages.map((msg) => (
                <Card key={msg.id} sx={{ mt: 1, backgroundColor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant="body1">{msg.text}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Feel Good Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5">Feel-Good Actions</Typography>
          <Box display="flex" gap={2} alignItems="center" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Add an activity (e.g., Take a walk)"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
            />
            <Button variant="outlined" onClick={handleAddAction}>
              Add
            </Button>
          </Box>
          <List>
            {feelGoodActions.map((action, index) => (
              <ListItem key={index}>{action}</ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Trusted Contacts */}
      <Card>
        <CardContent>
          <Typography variant="h5">Trusted Contacts</Typography>

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newContact.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
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
          <TextField
            fullWidth
            label="Applicable for Situation (e.g., Panic attack)"
            name="problemType"
            value={newContact.problemType}
            onChange={handleInputChange}
            margin="normal"
          />
          <FormControlLabel
            control={<Switch checked={newContact.shareMood} onChange={handleInputChange} name="shareMood" />}
            label="Share Mood Reports"
          />
          <FormControlLabel
            control={<Switch checked={newContact.shareJournal} onChange={handleInputChange} name="shareJournal" />}
            label="Share Journal Entries"
          />
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={handleAddContact}
            disabled={!newContact.name || (!newContact.email && !newContact.phone)}
          >
            Add Contact
          </Button>

          {contacts.length > 0 && (
            <List sx={{ mt: 2 }}>
              {contacts.map((contact, index) => (
                <React.Fragment key={contact.id}>
                  <ListItem>
                    <ListItemText
                      primary={contact.name}
                      secondary={
                        <>
                          {contact.email && `${contact.email}\n`}
                          {contact.phone && `${contact.phone}\n`}
                          {contact.problemType && `Applicable for: ${contact.problemType}\n`}
                          {contact.shareMood && '• Shares Mood Reports'}
                          {contact.shareMood && contact.shareJournal && ' • '}
                          {contact.shareJournal && '• Shares Journal Entries'}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteContact(contact.id)}>
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
    </Container>
  );
}

export default CriticalActionPlan;
