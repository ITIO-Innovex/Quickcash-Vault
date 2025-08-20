import './App.css'
import App from './App';
import { StrictMode } from 'react';
import { Box } from '@mui/material';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
     <Box className="page-wrapper">
    <App />
    </Box>
  </StrictMode>
);
