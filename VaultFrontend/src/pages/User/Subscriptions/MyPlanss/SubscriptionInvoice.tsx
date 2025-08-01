import { useState } from 'react';
import CustomModal from '@/components/CustomModal';
import WalletModal from './PaymentDetails';
import { Box, Button, Typography, Grid, Chip, } from '@mui/material';
import CustomButton from '@/components/CustomButton';

const SubscriptionInvoice = ({ open, invoice, handleClose }: any) => {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
const detailItem = (label: string, value: React.ReactNode) => (

   <Box className="invoice-row">
    <Typography variant="body2" fontWeight="bold">{label}:</Typography>
    <Box>{value}</Box> 
  </Box>
);

  return (
    <CustomModal open={open} onClose={handleClose}  disableBackdropClick={true} title="Subscription Invoice" sx={{ backgroundColor: 'background.default' }}>
      {invoice && (
        <Box sx={{ borderRadius: 2 }}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Invoice Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {detailItem('Status', invoice.status)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Amount', `$${invoice.amount}`)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Currency', invoice.currency)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Type', invoice.type)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Alignable', invoice.alignable ? 'Yes' : 'No')}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Recurrent Invoice ID', invoice.recurrentInvoiceId)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('External Client ID', invoice.externalClientId)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Invoice ID', invoice.id)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {detailItem('Last Modified', new Date(invoice.lastModifiedDate).toLocaleString())}
            </Grid>
          </Grid>
          <Box mt={4} textAlign="right">
            <CustomButton 
              onClick={() => setWalletModalOpen(true)}  >
              Initialize Payment
            </CustomButton>
          </Box>
          <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
        </Box>
      )}
    </CustomModal>
    
  );
};

export default SubscriptionInvoice;
