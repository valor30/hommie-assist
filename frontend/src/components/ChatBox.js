import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, List, ListItem, ListItemText, Typography, Avatar, Button, Snackbar, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LeadForm from './LeadForm';
import axios from 'axios';

const quickResponses = [
  'Plumbing Service',
  'HVAC Service',
  'Electrical Service',
  'Carpentry Service',
  'Painting & Drywall',
  'Roofing Service',
  'Flooring Service',
  'Masonry Service',
  'Window & Door',
  'Landscaping & Exterior',
  'General Handyman'
];

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [responseButtons, setResponseButtons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://i.pinimg.com/originals/79/04/42/7904424933cc535b666f2de669973530.gif');

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { type: 'user', text: inputMessage }]);
      setInputMessage('');
      generateRandomQuickResponses();

      try {
        const response = await fetch('http://127.0.0.1:5000/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputMessage }),
        });

        const data = await response.json();
        if (data.response === 'form_prompt') {
          setShowForm(true);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'bot', text: data.message },
          ]);
        }
      } catch (error) {
        console.error('Error communicating with backend:', error);
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://127.0.0.1:5000/api/image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.response === 'form_prompt') {
          setShowForm(true);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'user', image: data.imageUrl },
            { type: 'bot', text: data.message },
          ]);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/lead', formData);
      setMessages([...messages, { type: 'bot', text: 'Thank you for providing your details. We will get in touch with you soon!' }]);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowAlert(true);
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleQuickResponse = (response) => {
    setInputMessage(response);
    setMessages([...messages, { type: 'user', text: response }]);
    setResponseButtons([]);
  };

  const generateRandomQuickResponses = () => {
    const shuffledResponses = [...quickResponses].sort(() => 0.5 - Math.random());
    setResponseButtons(shuffledResponses.slice(0, 3));
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    generateRandomQuickResponses();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        bgcolor: '#1d4e89',
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        position: 'relative',
        margin: '0 auto',
        mt: 'auto',
        mb: 2,
        '@media (max-width: 768px)': {
          width: '100%',
          height: '80vh'
        },
        '@media (max-width: 480px)': {
          width: '100%',
          height: '60vh'
        },
        overflowY: 'auto'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          bgcolor: '#00b2ca',
          py: 1,
          px: 2,
          borderRadius: 2
        }}
      >
        <Avatar src={avatarUrl} sx={{ width: 56, height: 56, mr: 2 }} />
        <Typography variant="h6" sx={{ flex: 1, color: '#fff', fontWeight: 'bold' }}>
          Hommie-Assist
        </Typography>
      </Box>
      <Box
        sx={{
          height: '60vh',
          overflowY: 'auto',
          p: 2,
          bgcolor: '#eeebe3',
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        {messages.map((message, index) => (
          <ListItem key={index} sx={{ justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
            <ListItemText
              primary={message.type === 'user' ? <b>You</b> : <b>Hommie</b>}
              secondary={
                message.text ? (
                  <Typography sx={{ color: '#fff' }}>
                    {message.text}
                  </Typography>
                ) : message.image ? (
                  <img src={message.image} alt="User uploaded" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                ) : null
              }
              sx={{
                bgcolor: message.type === 'user' ? '#00b2ca' : '#f79256',
                color: '#fff',
                borderRadius: '16px',
                p: 1,
                maxWidth: '70%',
                wordWrap: 'break-word'
              }}
            />
          </ListItem>
        ))}
      </Box>
      {showForm && <LeadForm onSubmit={handleFormSubmit} onClose={() => setShowForm(false)} />}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span" sx={{ mr: 1 }}>
            Upload Image
          </Button>
        </label>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type your message and press enter..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          sx={{ flex: 1, mr: 1 }}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          sx={{
            color: 'white',
            bgcolor: '#00b2ca',
            '&:hover': { bgcolor: '#C2C2C2' },
            borderRadius: '50%'
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
      {responseButtons.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
          {responseButtons.slice(0, 3).map((response, index) => (
            <Button
              key={index}
              variant="contained"
              color="info"
              sx={{ bgcolor: '#58afdd', m: 1 }}
              onClick={() => handleQuickResponse(response)}
            >
              {response}
            </Button>
          ))}
        </Box>
      )}
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity="error">
          There was an error submitting the form. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatBox;
