import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, Paper, Grid, Popover, List, ListItem, ListItemText } from '@mui/material';
import { Helmet } from 'react-helmet';

const LearnPlurals = () => {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState('');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [learnedWords, setLearnedWords] = useState([]);

  useEffect(() => {
    generateSentence();
    const storedWords = JSON.parse(sessionStorage.getItem('previousSentences')) || [];
    setLearnedWords(storedWords);
  }, []);

  const generateSentence = async () => {
    try {
      const previousSentences = JSON.parse(sessionStorage.getItem('previousSentences')) || [];
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/generate_sentence`, { lesson: 'plurals', previousSentences });
      const newSentence = response.data;
      setResponseData(newSentence);
      setSentence(`${newSentence.turkish} (${newSentence.english})`);
      setOptionsVisible(true);
      setResult('');
      handleClose(); // Close the hint popover when a new sentence is generated

      // Save the new sentence to session storage
      previousSentences.push(newSentence);
      sessionStorage.setItem('previousSentences', JSON.stringify(previousSentences));
      setLearnedWords(previousSentences); // Update learned words list
    } catch (error) {
      console.error('Error generating sentence:', error);
    }
  };

  const handleOptionClick = (suffix) => {
    setOptionsVisible(false);
    if (responseData.turkishsuffix === suffix) {
      setResult(`Correct! The answer is ${responseData.turkish}${responseData.turkishsuffix} (${responseData.english})`);
    } else {
      setResult(`Incorrect! The correct answer is ${responseData.turkish}${responseData.turkishsuffix}`);
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
    <Container maxWidth="lg">
      <Helmet>
        <title>Learn Turkish Plurals</title>
      </Helmet>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
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
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 10, paddingLeft: 8 }}>
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4, width: '100%' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                History
              </Typography>
              <List>
                {learnedWords.map((word, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${word.turkish} (${word.english})`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LearnPlurals;
