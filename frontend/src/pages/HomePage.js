
import React from 'react';
import { Container, Box } from '@mui/material';
import ChatBox from '../components/ChatBox';

const HomePage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <ChatBox />
      </Box>
    </Container>
  );
};

export default HomePage;
