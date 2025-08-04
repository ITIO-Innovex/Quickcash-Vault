import { useState } from 'react';
import FirstSection from './FirstSection';
import { Box, useTheme } from '@mui/material';
import PageHeader from '@/components/common/pageHeader';

const Main = () => {
  const theme = useTheme();

  return (
    <Box className="dashboard-container"sx={{ backgroundColor: theme.palette.background.default }} >
      <PageHeader title="BlockChains" />
      <FirstSection /> 
    </Box>
  );
};
  
export default Main;
