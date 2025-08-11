import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const CommonLoader = ({ show = false }) => {
  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        bgcolor: 'rgba(255,255,255,0.7)',   // for light blur overlay
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={64}  sx={{
    color: '#483594', 
  }} />
    </Box>
  );
};

export default CommonLoader;
