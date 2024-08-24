import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, List, ListItem, ListItemText, Typography, Avatar, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';


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
  const [avatarUrl, setavatarUrl]=useState('https://i.pinimg.com/originals/79/04/42/7904424933cc535b666f2de669973530.gif');

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
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: data.message },
        ]);
      } catch (error) {
        console.error('Error communicating with backend:', error);
      }
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
    setResponseButtons(shuffledResponses.slice(1,3)); 
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
            '@MediaCapabilities(max-width:480px)':{
                width:'100%',
                height:'60vh'
            },
            overflowY:'auto'
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
                    <Typography sx={{ color: '#fff','@media(max-width:480px)':{
                    fontSize:'0.8rem',}, }}>
                      {message.text}
                    </Typography>
                  }
                  sx={{
                    bgcolor: message.type === 'user' ? '#00b2ca' : '#f79256',
                    color: '#fff',
                    borderRadius: '16px',
                    p: 1,
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                    '@media(max-width:480px)':{
                        maxWidth:'90%'
                    },
                    
                  }}
                />
              </ListItem>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              sx={{ flex: 1, mr: 1,
                '@media(max-width:480px)':{
                    fontSize:'0.8rem',
                },
                '& .MuiInputBase-input':{
                    backgroundColor: '#f0f0f0',
                    color:'#000',
                    padding:'10 10px'
                },width:'90%',
                maxWidth:'600px'
               }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              sx={{
                color:'white',
                bgcolor: '#00b2ca', 
                '&:hover': { bgcolor: '#C2C2C2' },
                borderRadius: '50%', '@media (max-width: 480px)': {
                    width: '2rem', 
                    height: '2rem',
                }
          
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
        </Box>
      );
    };
    
    export default ChatBox;
