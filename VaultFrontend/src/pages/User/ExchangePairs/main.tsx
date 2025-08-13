import React, { useState } from 'react';
import { Box, Button, TextField, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import PageHeader from '@/components/common/pageHeader';
import FirstSection from './FirstSection';
import CustomModal from '@/components/CustomModal';

const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const Main = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [toCurrency, setToCurrency] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [exchangeData, setExchangeData] = useState(null);

  // Open the modal
  const handleOpenModal = () => {
    setOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpen(false);
    setFromCurrency('');
    setToCurrency('');
    setAmount('');
    setExchangeData(null); // Clear the data when modal is closed
  };

  // Handle form submission to hit the API
  const handleSubmit = async () => {
    if (!fromCurrency || !toCurrency || !amount) return; // Do not submit if fields are empty

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }
      const response = await axios.get(`${url}/blockchain/rates`, {
        params: { fromCurrency, toCurrency, amount },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assuming that response.data.data is an array with the necessary fields
      const data = response.data.data; // Adjust this based on your response data structure
      if (data) {
        setExchangeData({
          fromCurrency: data.rateRequest.fromCurrency,
          toCurrency: data.rateRequest.toCurrency,
          rate: data.rate,
          minFromAmount: data.minFromAmount,
          maxFromAmount: data.maxFromAmount,
          minToAmount: data.minToAmount,
          maxToAmount: data.maxToAmount,
          Signature: data.signature,
        });
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false); // Disable the loading state after API response
    }
  };

  return (
    <Box className="dashboard-container" sx={{ backgroundColor: theme.palette.background.default }}>
      <PageHeader title="Exchange Pairs" buttonText="Calculate Rates" onButtonClick={handleOpenModal} />
      <FirstSection />

      {/* Custom Modal for Input */}
      <CustomModal title="Calculate Exchange Rate" open={open} onClose={handleCloseModal} disableBackdropClick={true}>
        <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
    Note: Only exchange rates for available pairs can be calculated.
  </Typography>
        <TextField
          fullWidth
          label="From Currency"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="To Currency"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!fromCurrency || !toCurrency || !amount || loading}
        >
          {loading ? 'Loading...' : 'Submit'}
        </Button>

        {/* Display exchange details once data is available */}
        {exchangeData && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4" sx={{mb:2}}>Exchange Details</Typography>
            <Typography>From Currency: {exchangeData.fromCurrency}</Typography>
            <Typography>To Currency: {exchangeData.toCurrency}</Typography>
            <Typography>Rate: {exchangeData.rate}</Typography>
            <Typography>Min From Amount: {exchangeData.minFromAmount}</Typography>
            <Typography>Max From Amount: {exchangeData.maxFromAmount}</Typography>
            <Typography>Min To Amount: {exchangeData.minToAmount}</Typography>
            <Typography>Max To Amount: {exchangeData.maxToAmount}</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '100%' }}>Signature:<br/>
            {exchangeData.Signature}
          </Typography>
          </Box>
        )}
      </CustomModal>
    </Box>
  );
};

export default Main;
