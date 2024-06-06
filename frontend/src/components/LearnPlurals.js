// src/components/LearnTurkish.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { Helmet } from 'react-helmet';

const LearnPlurals = () => {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [responseData, setResponseData] = useState({});

  useEffect(() => {
    generateSentence();
  }, []);

  const generateSentence = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/generate_sentence`, { lesson: 'plurals' });
      setResponseData(response.data);
      setSentence(`${response.data.turkish} (${response.data.english})`);
      setOptionsVisible(true);
      setResult('');
    } catch (error) {
      console.error('Error generating sentence:', error);
    }
  };

  const handleOptionClick = (suffix) => {
    setOptionsVisible(false);
    if (responseData.suffix === suffix) {
      setResult(`Correct! The answer is ${responseData.turkish}${responseData.suffix} (${responseData.english})`);
    } else {
      setResult(`Incorrect! The correct answer is ${responseData.turkish}${responseData.suffix}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Learn Turkish Plurals</title>
      </Helmet>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Learn Turkish: Plurals
        </Typography>
        <Box mb={2}>
          <Button variant="contained" color="primary" onClick={generateSentence}>
            Generate Sentence
          </Button>
        </Box>
        <Typography variant="h6" component="div" gutterBottom>
          {sentence}
        </Typography>
        <Box mt={2} mb={2}>
          {optionsVisible && (
            <>
              <Button variant="contained" onClick={() => handleOptionClick('lar')} sx={{ marginRight: 1 }}>
                lar
              </Button>
              <Button variant="contained" onClick={() => handleOptionClick('ler')}>
                ler
              </Button>
            </>
          )}
        </Box>
        <Typography variant="body1" component="div" gutterBottom>
          {result}
        </Typography>
      </Paper>
    </Container>
  );
};

export default LearnPlurals;
