import axios from 'axios';
import{ useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import CustomModal from '@/components/CustomModal';
import { Box, Typography, Grid, Chip, Button, Stepper, Step, StepLabel } from '@mui/material';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInputField';
import CustomSelect from '@/components/CustomDropdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PaymentDetails = ({ open, onClose, invoice }: any) => {
  const [activeStep, setActiveStep] = useState(0);
  const [anyCurrency, setAnyCurrency] = useState<boolean>(false);
  const [type, setType] = useState<'PLATFORM' | 'EXTERNAL' | 'CHECKOUT'>('PLATFORM');
  const [invoiceId, setInvoiceId] = useState<string | null>(localStorage.getItem("recurrentInvoiceId"));
  const [walletAccounts, setWalletAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  // Confirm Payment Step State
  const [confirmForm, setConfirmForm] = useState({
    paymentId: '',
    invoiceId: '',
    type: '',
    accountId: '',
    currency: '',
    anyCurrency: false,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchWalletData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/wallet/all-accounts`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWalletAccounts(response.data.data || []);
        } catch (error) {
          console.error('❌ Error fetching wallet data:', error);
        }
      };
      fetchWalletData();
    } else {
      setActiveStep(0);
      setSelectedAccount(null);
    }
  }, [open]);

  const handleNext = () => setActiveStep((prev) => prev + 1);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    localStorage.setItem('selectedAccountId', accountId);
    
  };

 const handleCreatePayment = async () => {
  try {
    const token = localStorage.getItem('token');

    const payload = {
      accountId: selectedAccount,
      invoiceId: invoiceId,    
      type: type,
      currency: invoice?.currency || 'USDT',
      anyCurrency: anyCurrency,
    };

    const response = await axios.post(`${API_URL}/subscription/invoice/payment`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('✅ Payment API response:', response.data);
    setActiveStep(2);
  } catch (error: any) {
    console.error('❌ Payment API error:', error.response?.data || error.message);
  }
};

  return (
    <CustomModal open={open} onClose={onClose} disableBackdropClick={true} title="Invoice Payment" sx={{ backgroundColor: 'background.default' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        <Step><StepLabel>Select Account</StepLabel></Step>
        <Step><StepLabel>Create Payment</StepLabel></Step>
        <Step><StepLabel>Confirm Payment</StepLabel></Step>
        <Step><StepLabel>Update Payment</StepLabel></Step>
      </Stepper>

      {/* Step 1 - Select Account */}
      {activeStep === 0 && (
        <Box className="select-account-step">
          <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
            Select Account
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {walletAccounts.map((acc) => (
              <Grid item xs={12} sm={6} md={4} key={acc.account}>
                <Box
                  onClick={() => handleAccountSelect(acc.account)}
                  sx={{
                    border: selectedAccount === acc.account ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    borderRadius: '16px',
                    p: 3,
                    cursor: 'pointer',
                    background: selectedAccount === acc.account ? '#f0f7ff' : '#fff',
                    boxShadow: selectedAccount === acc.account ? '0 2px 8px #1976d233' : '0 1px 4px #0001',
                    transition: 'all 0.2s',
                    mb: 2,
                  }}
                >
                  <Typography fontWeight={600} mb={0.5}>Account ID:</Typography>
                  <Typography mb={1}>{acc.account}</Typography>
                  <Typography fontWeight={600} mb={0.5}>Type:</Typography>
                  <Typography mb={1}>{acc.accountType}</Typography>
                  <Chip
                    label={acc.status}
                    size="small"
                    sx={{
                      backgroundColor: acc.status === 'ACTIVE' ? '#4caf50' : '#f44336',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 13,
                      borderRadius: 1.5,
                      mt: 1,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} textAlign="right">
            <CustomButton disabled={!selectedAccount} onClick={handleNext}>Proceed</CustomButton>
          </Box>
        </Box>
      )}

      {/* Step 2 - Create Payment */}
      {activeStep === 1 && (
        <Box py={3} maxWidth={500} mx="auto">
          <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
            Enter Payment Details
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2} textAlign="center">
            <strong>Note:</strong> Please use <strong>Platform</strong> for payment type unless specified otherwise.
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <CustomInput label="Invoice ID" value={invoiceId || ''} disabled />
            <CustomInput label="Account ID" value={selectedAccount || ''} disabled />

            <CustomSelect
              label="Payment Type"
              value={type}
              onChange={(e) => setType(e.target.value as 'PLATFORM' | 'EXTERNAL' | 'CHECKOUT')}
              options={[
                { label: 'Platform', value: 'PLATFORM' },
                { label: 'External', value: 'EXTERNAL' },
                { label: 'Checkout', value: 'CHECKOUT' },
              ]}
            />

            <CustomInput label="Currency" value={invoice?.currency || 'USDT'} disabled />

            <CustomSelect
              label="Any Currency"
              value={String(anyCurrency)}
              onChange={(e) => setAnyCurrency(e.target.value === 'true')}
              options={[
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ]}
            />

            <Box mt={4} textAlign="center">
              <CustomButton
                // onClick={handleCreatePayment}
                // disabled={!selectedAccount || !invoiceId}
                onClick={() => setActiveStep(2)}
              >
                Create Payment
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* Step 3 - Confirm Payment */}
      {activeStep === 2 && (
        <Box py={3} maxWidth={500} mx="auto">
          <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
            Confirm Payment
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <CustomInput
              label="Payment ID"
              name="paymentId"
              value={confirmForm.paymentId}
              onChange={e => setConfirmForm(f => ({ ...f, paymentId: e.target.value }))}
            />
            <CustomInput
              label="Invoice ID"
              name="invoiceId"
              disabled
              value={confirmForm.invoiceId || invoiceId || ''}
              onChange={e => setConfirmForm(f => ({ ...f, invoiceId: e.target.value }))}
              required
            />
            <CustomSelect
              label="Payment Type"
              value={confirmForm.type || type}
              onChange={e => setConfirmForm(f => ({ ...f, type: e.target.value as string }))}
              options={[
                { label: 'Platform', value: 'PLATFORM' },
                { label: 'External', value: 'EXTERNAL' },
                { label: 'Checkout', value: 'CHECKOUT' },
              ]}
              required
            />
            <CustomInput
              label="Account ID"
              name="accountId"
              disabled
              value={confirmForm.accountId || selectedAccount || ''}
              onChange={e => setConfirmForm(f => ({ ...f, accountId: e.target.value }))}
              required
            />
            <CustomInput
              label="Currency"
              name="currency"
              value={confirmForm.currency || invoice?.currency || ''}
              onChange={e => setConfirmForm(f => ({ ...f, currency: e.target.value }))}
            />
            <CustomSelect
              label="Any Currency"
              value={String(confirmForm.anyCurrency)}
              onChange={e => setConfirmForm(f => ({ ...f, anyCurrency: e.target.value === 'true' }))}
              options={[
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ]}
              required
            />
            <Box mt={4} textAlign="center">
              <CustomButton
                onClick={async () => {
                  setConfirmLoading(true);
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('Token not found');
                    const payload: any = {
                      invoiceId: confirmForm.invoiceId || invoiceId,
                      type: confirmForm.type || type,
                      accountId: confirmForm.accountId || selectedAccount,
                      anyCurrency: confirmForm.anyCurrency,
                    };
                    if (confirmForm.paymentId) payload.paymentId = confirmForm.paymentId;
                    if (confirmForm.currency) payload.currency = confirmForm.currency;
                    await axios.post(`${API_URL}/subscription/invoice/payment/confirm`, payload, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setActiveStep(3);
                  } catch (err: any) {
                    alert(err?.response?.data?.message || err.message || 'Failed to confirm payment');
                  } finally {
                    setConfirmLoading(false);
                  }
                }}
                disabled={
                  !confirmForm.invoiceId || !confirmForm.accountId || !confirmForm.type
                }
              >
                {confirmLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Payment'}
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* Step 4 - Update Payment */}
      {activeStep === 3 && (
        <Box py={3} maxWidth={500} mx="auto">
          <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
            Update Payment
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <CustomInput
              label="Payment ID"
              name="paymentId"
              value={confirmForm.paymentId}
              onChange={e => setConfirmForm(f => ({ ...f, paymentId: e.target.value }))}
              required
            />
            <CustomInput
              label="Invoice ID"
              name="invoiceId"
              disabled
              value={confirmForm.invoiceId || invoiceId || ''}
              onChange={e => setConfirmForm(f => ({ ...f, invoiceId: e.target.value }))}
              required
            />
            <CustomSelect
              label="Payment Type"
              value={confirmForm.type || type}
              onChange={e => setConfirmForm(f => ({ ...f, type: e.target.value as string }))}
              options={[
                { label: 'Platform', value: 'PLATFORM' },
                { label: 'External', value: 'EXTERNAL' },
                { label: 'Checkout', value: 'CHECKOUT' },
              ]}
              required
            />
            <CustomInput
              label="Account ID"
              name="accountId"
              disabled
              value={confirmForm.accountId || selectedAccount || ''}
              onChange={e => setConfirmForm(f => ({ ...f, accountId: e.target.value }))}
              required
            />
            <CustomInput
              label="Currency"
              name="currency"
              value={confirmForm.currency || invoice?.currency || ''}
              onChange={e => setConfirmForm(f => ({ ...f, currency: e.target.value }))}
            />
            <CustomSelect
              label="Any Currency"
              value={String(confirmForm.anyCurrency)}
              onChange={e => setConfirmForm(f => ({ ...f, anyCurrency: e.target.value === 'true' }))}
              options={[
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ]}
              required
            />
            <Box mt={4} textAlign="center">
              <CustomButton
                onClick={async () => {
                  setUpdateLoading(true);
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('Token not found');
                    const payload: any = {
                      paymentId: confirmForm.paymentId,
                      invoiceId: confirmForm.invoiceId || invoiceId,
                      type: confirmForm.type || type,
                      accountId: confirmForm.accountId || selectedAccount,
                      anyCurrency: confirmForm.anyCurrency,
                    };
                    if (confirmForm.currency) payload.currency = confirmForm.currency;
                    await axios.put(`${API_URL}/subscription/invoice/payment/update`, payload, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setActiveStep(4);
                  } catch (err: any) {
                    alert(err?.response?.data?.message || err.message || 'Failed to update payment');
                  } finally {
                    setUpdateLoading(false);
                  }
                }}
                disabled={
                  !confirmForm.paymentId || !confirmForm.invoiceId || !confirmForm.accountId || !confirmForm.type || confirmForm.anyCurrency === undefined || updateLoading
                }
              >
                {updateLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Payment'}
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* Step 5 - Done */}
      {activeStep === 4 && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Payment Updated!
          </Typography>
          <Typography>
            Your payment has been updated for invoice <b>{invoice?.id}</b>.
          </Typography>
          <Box mt={4}>
            <CustomButton onClick={onClose}>Close</CustomButton>
          </Box>
        </Box>
      )}
    </CustomModal>
  );
};

export default PaymentDetails;