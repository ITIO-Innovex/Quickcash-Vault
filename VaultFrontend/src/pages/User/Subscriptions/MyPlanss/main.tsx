import { Box, useTheme, Button } from '@mui/material'
import PageHeader from '@/components/common/pageHeader'
import CurrentSubscriptionCard from './CurrentSubscriptionCard'
import SubscriptionInvoice from './SubscriptionInvoice'
import React, { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Main = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

 const handleInvoiceClick = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${API_URL}/subscription/invoice`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const invoiceData = response.data.data;
    console.log("📄 Invoice data:", invoiceData);
    setInvoice(invoiceData); 
    setOpen(true);

    // ✅ Store recurrentInvoiceId in localStorage
   const invoiceId = invoiceData.id;
   if (invoiceId) {
      localStorage.setItem("InvoiceId", invoiceId);
    }
    console.log("Invoice ID stored in localStorage:", invoiceId);

  } catch (err) {
    alert('Failed to fetch invoice');
    console.error('Invoice fetch error:', err);
  }
  setLoading(false);
};
  const handleClose = () => setOpen(false);

  return (
    <Box className="dashboard-container" sx={{ backgroundColor: theme.palette.background.default }}>
     <PageHeader title="My Plans" buttonText={loading ? 'Loading...' : 'Your Invoice'} loading={loading} onButtonClick={handleInvoiceClick} />

      <CurrentSubscriptionCard/>
      <SubscriptionInvoice open={open} invoice={invoice} handleClose={handleClose} />
    </Box>
  )
}

export default Main