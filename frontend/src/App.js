import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import About from './components/About';
import Contact from './components/Contact';
import LearnPlurals from './components/LearnPlurals';
import './App.css';

function App() {
  return (
    <Router>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Learn Turkish
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <Button color="inherit" component={Link} to="/contact">Contact</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Box mt={2}>
            <Routes>
              <Route exact path="/" element={<LearnPlurals />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
