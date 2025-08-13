import api from '@/helpers/apiHelper';
import { useEffect, useState } from 'react';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { Box, Button, Grid, Typography, } from '@mui/material';
const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";
import WalletModal from '../pages/User/Subscriptions/MyPlanss/PaymentDetails';

const InvoicePayment = ({ open, invoice, handleClose }: any) => {
  const [loading, setLoading] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);

// When modal opens & invoice id is there, fetch details
  useEffect(() => {
    if (open && invoice) {
      setLoading(true);
      fetchInvoiceDetails(invoice)
        .then((data) => {
          setInvoiceDetails(data);   // Set invoice object to state
          setLoading(false);
        })
        .catch(() => {
          setInvoiceDetails(null);
          setLoading(false);
        });
    } else {
      setInvoiceDetails(null); // reset when closed/cleared
    }
  }, [open, invoice]);

  const fetchInvoiceDetails = async (invoiceId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`${url}/subscription/invoice/${invoiceId}`);
      const data = response.data;
      console.log("API Response for Invoice ID:", invoiceId, data); 
      localStorage.setItem("InvoiceId",invoiceId);
      // You may also want to do: return data.data if API wraps response in {data: ...}
      return data;
    } catch (error) {
      console.error("API error fetching invoice details:", error);
      return null;
    }
  };

    const detailItem = (label: string, value: React.ReactNode) => (

        
    <Box className="invoice-row">
        <Typography variant="body2" fontWeight="bold">{label}:</Typography>
        <Box>{value}</Box> 
    </Box>
    );

  return (
    <CustomModal open={open} onClose={handleClose}  disableBackdropClick={true} title=" Invoice Payment Details" sx={{ backgroundColor: 'background.default' }}>
       {loading ? (
    <Typography align="center">Loading invoice details...</Typography>
  ) : invoiceDetails ? (
        <Box sx={{ borderRadius: 2 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Invoice ID : {invoice}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {detailItem('Status', invoiceDetails.data?.status)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Amount', `${invoiceDetails.data?.amount}`)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Currency', invoiceDetails.data?.currency)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Type', invoiceDetails.data?.type)}
            </Grid>
             <Grid item xs={12} sm={6}>
              {detailItem('Invoice ID', invoiceDetails.data?.id)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('External Client ID', invoiceDetails.data?.externalClientId)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Alignable', invoiceDetails.data?.alignable ? 'Yes' : 'No')}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Last Modified', new Date(invoiceDetails.data?.lastModifiedDate).toLocaleString())}
            </Grid>
          </Grid>
          <Box mt={4} textAlign="right">
           <CustomButton 
            onClick={() => setWalletModalOpen(true)} 
            loading={loading}>
            {loading ? 'Loading...' : 'Initialize Payment'}
          </CustomButton>

          </Box>
          <WalletModal open={walletModalOpen}  invoice={invoiceDetails?.data?.id || invoice} onClose={() => setWalletModalOpen(false)} />
        </Box>
        ) : (
    <Typography align="center">No invoice data available!</Typography>
  )}
    </CustomModal>
    
  );
};

export default InvoicePayment;
