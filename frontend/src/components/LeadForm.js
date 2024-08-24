import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

const LeadForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    service: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', phone: '', service: '' });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6">Lead Capture Form</Typography>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Your name"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="yourmail@example.com"
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        placeholder="12345 67890"
      />
      <TextField
        label="Service Interested In"
        name="service"
        value={formData.service}
        onChange={handleChange}
        required
        placeholder="Plumbing Service"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      <Button onClick={onClose} variant="outlined" color="secondary">
        Close
      </Button>
    </Box>
  );
};

export default LeadForm;
