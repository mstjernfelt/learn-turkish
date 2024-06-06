import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" component="div">
          This is an application to help you learn Turkish plurals.
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
