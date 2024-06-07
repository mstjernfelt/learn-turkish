import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

const LearnPluralsHint = () => {
  const [showHint, setShowHint] = useState(false);

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={handleShowHint}>
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </Button>
      {showHint && (
        <Box mt={2}>
          <Typography variant="body1">
            -a-ı-o-u --- lar
            <br />
            -e-i-ö-ü --- ler
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LearnPluralsHint;
