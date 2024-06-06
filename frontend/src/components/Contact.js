import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Contact = () => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" component="div">
          For more information, please contact us at info@learnturkish.com.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Contact;
