import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, Paper, Grid, Alert } from '@mui/material';
import { Helmet } from 'react-helmet';
import LearnPluralsHint from './LearnPluralsHint';

const LearnPlurals = () => {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [showHint, setShowHint] = useState(false);

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
      setShowHint(false);  // Reset hint visibility
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

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>Learn Turkish Plurals</title>
      </Helmet>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Learn Turkish: Plurals
        </Typography>
        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" color="primary" onClick={generateSentence}>
                Generate Sentence
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handleShowHint}>
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flexGrow={1} mr={2}>
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
          </Box>
          {showHint && (
            <Box mt={2}>
              <Alert severity="info">
                -a-ı-o-u --- lar
                <br />
                -e-i-ö-ü --- ler
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, width: '100%' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          What you will learn
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
          In Turkish, the suffixes -lar and -ler are used to indicate plural nouns. The vowel harmony rules apply to these suffixes.
        </Typography>
      </Paper>
    </Container>
  );
};

export default LearnPlurals;
