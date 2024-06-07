import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, Paper, Grid, Popover } from '@mui/material';
import { Helmet } from 'react-helmet';

const LearnPlurals = () => {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

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
      handleClose(); // Close the hint popover when a new sentence is generated
    } catch (error) {
      console.error('Error generating sentence:', error);
    }
  };

  const handleOptionClick = (suffix) => {
    setOptionsVisible(false);
    if (responseData.suffix.includes(suffix)) {
      setResult(`Correct! The answer is ${responseData.turkish}${responseData.suffix} (${responseData.english})`);
    } else {
      setResult(`Incorrect! The correct answer is ${responseData.turkish}${responseData.suffix}`);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
              <Button
                variant="contained"
                color="secondary"
                aria-describedby={id}
                onClick={handleClick}
              >
                Hint
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <Box p={2}>
                  <Typography variant="body1">
                    -a-ı-o-u --- lar
                    <br />
                    -e-i-ö-ü --- ler
                  </Typography>
                </Box>
              </Popover>
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
