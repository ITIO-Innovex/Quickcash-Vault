import axios from 'axios';
import api from '@/helpers/apiHelper';
import { Currency } from 'lucide-react';
import{ useEffect, useState } from 'react';
import { useAppToast } from '@/utils/Toast';
import { CircularProgress } from '@mui/material';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import CustomSelect from '@/components/CustomDropdown';
import CustomInput from '@/components/CustomInputField';
import { Box, Typography, Grid, Chip, Stepper, Step, StepLabel } from '@mui/material';

const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const PaymentDetails = ({ open, onClose, invoice }: any) => {
  const toast = useAppToast();
  const [activeStep, setActiveStep] = useState(0);
  const [anyCurrency, setAnyCurrency] = useState<boolean>(false);
  const [currency , setCurrency] = useState('ETH');
  const [type, setType] = useState<'PLATFORM' | 'EXTERNAL' | 'CHECKOUT'>('PLATFORM');
  const [invoiceId, setInvoiceId] = useState<string | null>(localStorage.getItem("InvoiceId"));
  const [paymentId, setPaymentId] = useState<string | null>(localStorage.getItem("PaymentId"));
  const [walletAccounts, setWalletAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(localStorage.getItem('selectedAccountId'));
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchWalletData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${url}/wallet/all-accounts`, {
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
        currency: currency,
        anyCurrency: anyCurrency,
      };

      const response = await axios.post(`${url}/subscription/invoice/payment`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Payment API response:', response.data);
      // Set payment ID to localStorage
      const paymentId = response.data?.data?.id;
      if (paymentId) {
        localStorage.setItem('paymentId', paymentId);     // Storage me save
        setPaymentId(paymentId);                          // State update
      } else {
        toast.error('Payment ID not found in the response');
      }
      // Show success toast message
      toast.success(response.data?.message || 'Invoice payment request sent successfully');

      setActiveStep(2); // Proceed to next step
    } catch (error: any) {
      if (error.response) {
        const { status, message } = error.response.data || {};
        if (
          status === 400 &&
          (message === "Invoice has been completed" || message?.includes("Invoice has been completed"))
        ) {
          toast.success(message);
          // Optionally: dispatch success, redirect, etc.
        } else {
          toast.error(message || "Some error occurred");
        }
      } else {
        toast.error("Something went wrong");
      }
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
            <CustomInput label="Invoice ID" value={invoiceId || ''} disabled  required/>
            <CustomInput label="Account ID" value={selectedAccount || ''} disabled required/>

            <CustomSelect
              label="Payment Type"
              value={type}
              onChange={(e) => setType(e.target.value as 'PLATFORM' | 'EXTERNAL' | 'CHECKOUT')}
              options={[
                { label: 'Platform', value: 'PLATFORM' },
                { label: 'External', value: 'EXTERNAL' },
                { label: 'Checkout', value: 'CHECKOUT' },
              ]}
              required
            />

            <CustomInput label="Currency" value={'ETH'} disabled />

            <CustomSelect
              label="Any Currency"
              value={String(anyCurrency)}
              onChange={(e) => setAnyCurrency(e.target.value === 'true')}
              options={[
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ]}
              required
            />

            <Box mt={4} textAlign="center">
              <CustomButton
                onClick={handleCreatePayment}
                disabled={!selectedAccount || !invoiceId}
                // onClick={() => setActiveStep(2)}
              >
               {confirmLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Payment'}
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}

      {/* Step 3- Confirm Payment */}
      {activeStep === 2 && (
        <Box py={3} maxWidth={500} mx="auto">
          <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
            Confirm Payment
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <CustomInput label="Payment ID" name="paymentId" value={paymentId} disabled />
            <CustomInput label="Invoice ID" name="invoiceId" disabled value={invoiceId} />
            <CustomSelect label="Payment Type" value={type} onChange={(e) => setType(e.target.value as 'PLATFORM' | 'EXTERNAL' | 'CHECKOUT')}
              options={[
                { label: 'Platform', value: 'PLATFORM' },
                { label: 'External', value: 'EXTERNAL' },
                { label: 'Checkout', value: 'CHECKOUT' },
              ]}
            />
            <CustomInput label="Account ID" name="accountId"  disabled value={selectedAccount} />
             <CustomInput label="Currency" value={currency} disabled />
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
                onClick={async () => {
                  // Confirm Payment API call
                  try {
                    if (!(paymentId && selectedAccount && invoiceId && type)) return;
                    setConfirmLoading(true);
                    const token = localStorage.getItem('token');
                    const payload = {
                      paymentId,
                      invoiceId,
                      type,
                      accountId: selectedAccount,
                      currency,
                      anyCurrency,
                    };
                    const response = await axios.post(`${url}/subscription/invoice/payment/confirm`, payload, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log("Invoice Payment Confirm response",response.data);
                    // Success: go to next step
                    toast.success(response.data?.message || 'Invoice payment request paid successfully');
                    setActiveStep(3);
                  } catch (err: any) {
                      if (err?.response?.data?.message) {
                        toast.error(err.response.data.message);
                      } else {
                        toast.error(err?.message || 'Failed to confirm payment');
                      }
                    } finally {
                      setConfirmLoading(false);
                    }
                }}
                disabled={!(paymentId)}
              >
                {confirmLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Payment'}
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}
       {/* { Step 3 - update Payment */}
       {activeStep === 3 && (
        <Box py={3} maxWidth={500} mx="auto">
          <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
            Update Payment
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <CustomInput label="Payment ID" name="paymentId" value={paymentId} disabled />
            <CustomInput label="Invoice ID" name="invoiceId" disabled value={invoiceId} />
            <CustomSelect label="Payment Type" value={type} onChange={(e) => setType(e.target.value as 'PLATFORM' | 'EXTERNAL' | 'CHECKOUT')}
              options={[
                { label: 'Platform', value: 'PLATFORM' },
                { label: 'External', value: 'EXTERNAL' },
                { label: 'Checkout', value: 'CHECKOUT' },
              ]}
            />
            <CustomInput label="Account ID" name="accountId" disabled value={selectedAccount} />
             <CustomInput label="Currency" value={currency} disabled />
            <CustomSelect label="Any Currency" value={String(anyCurrency)} onChange={(e) => setAnyCurrency(e.target.value === 'true')}
              options={[
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' },
              ]}
            />
            <Box mt={4} textAlign="center">
              <CustomButton
                onClick={async () => {
                  // Confirm Payment API call
                  try {
                    if (!(paymentId && selectedAccount && invoiceId && type)) return;
                    setConfirmLoading(true);
                    const token = localStorage.getItem('token');
                    const payload = {
                      paymentId,
                      invoiceId,
                      type,
                      accountId: selectedAccount,
                      currency,
                      anyCurrency,
                    };
                    console.log('🚩 Payment Update Payload:', payload);
                    const response = await api.post(`${url}/subscription/invoice/payment/update`, payload, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log('Invoice Payment Update Response',response.data);
                    // Success: go to next step
                    toast.success(response.data?.message || 'Invoice payment request updated successfully');
                    setActiveStep(4);
                  } catch (err: any) {
                      if (err?.response?.data?.message) {
                        toast.error(err.response.data.message);
                      } else {
                        toast.error(err?.message || 'Failed to update payment');
                      }
                    } finally {
                      setConfirmLoading(false);
                    }
                }}
                disabled={!(paymentId)}
              >
                {confirmLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Payment'}
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