import { Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/pageHeader';
import AllAccounts from './AllAccounts';

const Main = () => {
  
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box className="dashboard-container" sx={{ backgroundColor: theme.palette.background.default }} >
       <PageHeader title="Wallet Accounts" />
       <AllAccounts/>
    </Box>
  );
};

export default Main;
