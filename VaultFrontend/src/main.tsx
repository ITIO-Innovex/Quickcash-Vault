import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './helpers/setupAxios';
import App from './App';
import './App.css'
import { Box } from '@mui/material';
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
     <Box className="page-wrapper">
    <App />
    </Box>
  </StrictMode>
);
