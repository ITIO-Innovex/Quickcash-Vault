import axios from 'axios';
import{ useEffect, useState } from 'react';
import CustomModal from '@/components/CustomModal';
import { Box, Typography, Grid, Chip, Button, Stepper, Step, StepLabel } from '@mui/material';
import CustomButton from '@/components/CustomButton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PaymentDetails = ({ open, onClose, invoice }: any) => {
  const [activeStep, setActiveStep] = useState(0);
  const [walletAccounts, setWalletAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const fetchWalletData = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_URL}/wallet/all-accounts`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWalletAccounts(response.data.data || []);
        } catch (error) {
          console.error("❌ Error fetching wallet data:", error);
        }
      };
      fetchWalletData();
    }
    if (!open) {
      setActiveStep(0);
      setSelectedAccount(null);
    }
  }, [open]);

  const handleNext = () => setActiveStep((prev) => prev + 1);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    localStorage.setItem('selectedAccountId', accountId);
  };

  return (
    <CustomModal open={open} onClose={onClose} title="Invoice Payment" sx={{ backgroundColor: 'background.default' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        <Step><StepLabel> Select Account </StepLabel></Step>
        <Step><StepLabel> Create Payment </StepLabel></Step>
        <Step><StepLabel> Confirm Payment </StepLabel></Step>
      </Stepper>
      {activeStep === 0 && (
        <Box className="select-account-step">
          <Typography variant="h6" mb={2} fontWeight="bold" className="select-account-title" style={{ color: '#222', textAlign: 'center' }}>
            Select Account
          </Typography>
          <Grid container spacing={2} justifyContent="center" className="wallet-grid">
            {walletAccounts.map((acc: any) => (
              <Grid item xs={12} sm={6} md={4} key={acc.account} className="wallet-grid-item">
                <Box
                  className={`wallet-card${selectedAccount === acc.account ? ' wallet-card-selected' : ''}`}
                  sx={{
                    border: selectedAccount === acc.account ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    borderRadius: '16px',
                    p: 3,
                    cursor: 'pointer',
                    background: selectedAccount === acc.account ? '#f0f7ff' : '#fff',
                    boxShadow: selectedAccount === acc.account ? '0 2px 8px #1976d233' : '0 1px 4px #0001',
                    transition: 'all 0.2s',
                    marginBottom: '12px',
                  }}
                  onClick={() => handleAccountSelect(acc.account)}
                >
                  <Typography className="wallet-label" style={{ fontWeight: 600, marginBottom: 4 ,color:'text.gray'}}>Account ID:</Typography>
                  <Typography className="wallet-value" style={{ marginBottom: 8 }}>{acc.account}</Typography>
                  <Typography className="wallet-label" style={{ fontWeight: 600, marginBottom: 4 ,color:'text.gray'}}>Type:</Typography>
                  <Typography className="wallet-value" style={{ marginBottom: 8 }}>{acc.accountType}</Typography>
                  <Chip
                    label={acc.status}
                    size="small"
                    className={`wallet-status-chip ${acc.status === 'ACTIVE' ? 'wallet-status-active' : 'wallet-status-inactive'}`}
                    style={{
                      backgroundColor: acc.status === 'ACTIVE' ? '#4caf50' : '#f44336',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 13,
                      marginTop: 8,
                      borderRadius: 6,
                      padding: '0 8px',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} textAlign="right">
            <CustomButton disabled={!selectedAccount} onClick={handleNext}> Proceed </CustomButton>
          </Box>
        </Box>
      )}
      {activeStep === 1 && (
        <Box textAlign="center" py={6} className="confirm-payment-step">
          <Typography variant="h6" mb={2} fontWeight="bold" className="confirm-payment-title" style={{ color: '#222' }}>
            Payment Step (Coming Soon)
          </Typography>
          <Typography>Your selected account: <b>{selectedAccount}</b></Typography>
          <Box mt={4}>
            <CustomButton  onClick={onClose} className="close-btn" style={{ borderRadius: 8, padding: '8px 32px', fontWeight: 600 }}>
              Create Payment
            </CustomButton>
          </Box>
        </Box>
      )}
    </CustomModal>
  );
};

export default PaymentDetails;