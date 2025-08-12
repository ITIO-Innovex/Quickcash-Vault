import { Box, useTheme, Button, Typography } from '@mui/material';
import { useState } from 'react'; // To manage modal visibility and data
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/pageHeader';
import AllAccounts from './AllAccounts';
import axios from 'axios';
import CustomModal from '@/components/CustomModal';
const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const Main = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // State to handle modal visibility and data
  const [openModal, setOpenModal] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [amountData, setAmountData] = useState(null);

  // Handle button click to fetch balance
  const fetchBalance = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${url}/wallet/balance-all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      console.log('API Response:', response.data);
      console.log(response.data.data.total);

      // Set response data to the state
      setBalanceData(response.data.data);  
      setAmountData(response.data.data.total);
      // Open modal to show balance data
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }finally {
    setLoading(false); // Loader off
  }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setBalanceData(null);  // Clear data when modal closes
  };

  return (
    <Box className="dashboard-container" sx={{ backgroundColor: theme.palette.background.default }}>
      <PageHeader  title="Wallet Accounts"  buttonText={loading ? "Loading..." : "Total Balance"}  loading={loading} onButtonClick={fetchBalance}/>
      <AllAccounts />
      
      {/* Custom Modal for displaying balance */}
      <CustomModal open={openModal} onClose={handleCloseModal} title="Wallet Balance Details" disableBackdropClick={true} >
        {/* ==== Show Total Amount at the top ==== */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="primary">
          <strong>Total Balance:</strong> {amountData}
        </Typography>
      </Box>
        {/* Map over the balances array to display data */}
        {balanceData?.balances?.length > 0 ? (
          balanceData.balances.map((balance, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Account ID:</strong> {balance.account}
              </Typography>
              <Typography variant="body1">
                <strong>Crypto Balance:</strong> {balance.balance} {balance.currency.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Last Updated:</strong> {new Date(balance.lastUpdated).toLocaleString()}
              </Typography>
              
            </Box>
          ))
        ) : (
          <Typography variant="body1">No balance data available</Typography>
        )}
      </CustomModal>
    </Box>
  );
};

export default Main;
