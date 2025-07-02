import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Paper,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  Radio,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import {
  ArrowUpDown,
  RefreshCw,
  Building2,
  Clock,
  Receipt,
} from 'lucide-react';
import CustomButton from '@/components/CustomButton';
import Flag from 'react-world-flags';
import CommonTooltip from '@/components/common/toolTip';

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  country: string;
  currency: string;
}

interface CurrencySelectionStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  selectedBeneficiary?: Beneficiary | null;
}

const CurrencySelectionStep: React.FC<CurrencySelectionStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
  selectedBeneficiary,
}) => {
  const theme = useTheme();
  const [fromCurrency, setFromCurrency] = useState(
    formData.fromCurrency || 'USD'
  );
  const [toCurrency, setToCurrency] = useState(
    formData.toCurrency || selectedBeneficiary?.currency || 'CAD'
  );
  const [sendAmount, setSendAmount] = useState(formData.sendAmount || '1000');
  const [receiveAmount, setReceiveAmount] = useState(
    formData.receiveAmount || '1250.00'
  );
  const [isEditingSend, setIsEditingSend] = useState(true);
  const [chargesPaidBy, setChargesPaidBy] = useState('OUR');

  const currencies = [
    { code: 'USD', name: 'United States', currency: 'USD', flagCode: 'US' },
    { code: 'EUR', name: 'European Union', currency: 'EUR', flagCode: 'EU' },
    { code: 'GBP', name: 'United Kingdom', currency: 'GBP', flagCode: 'GB' },
    { code: 'INR', name: 'India', currency: 'INR', flagCode: 'IN' },
    { code: 'CAD', name: 'Canada', currency: 'CAD', flagCode: 'CA' },
    { code: 'AUD', name: 'Australia', currency: 'AUD', flagCode: 'AU' },
    { code: 'JPY', name: 'Japan', currency: 'JPY', flagCode: 'JP' },
    { code: 'CHF', name: 'Switzerland', currency: 'CHF', flagCode: 'CH' },
  ];

  const exchangeRate =
    fromCurrency === 'USD' && toCurrency === 'CAD' ? 1.25 : 1.25;
  const fee = 550.62;

  // Set initial currencies from beneficiary when component mounts
  useEffect(() => {
    if (selectedBeneficiary?.currency && !formData.toCurrency) {
      setToCurrency(selectedBeneficiary.currency);
    }
  }, [selectedBeneficiary]);

  useEffect(() => {
    if (sendAmount && isEditingSend) {
      const converted = (parseFloat(sendAmount) * exchangeRate).toFixed(2);
      setReceiveAmount(converted);
    } else if (receiveAmount && !isEditingSend) {
      const converted = (parseFloat(receiveAmount) / exchangeRate).toFixed(2);
      setSendAmount(converted);
    }
  }, [sendAmount, receiveAmount, isEditingSend, exchangeRate]);

  const handleSendAmountChange = (value: string) => {
    setSendAmount(value);
    setIsEditingSend(true);
  };

  const handleReceiveAmountChange = (value: string) => {
    setReceiveAmount(value);
    setIsEditingSend(false);
  };

  const handleSwapCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    const tempAmount = sendAmount;
    setSendAmount(receiveAmount);
    setReceiveAmount(tempAmount);
    setIsEditingSend(!isEditingSend);
  };

  const handleContinue = () => {
    if (fromCurrency && toCurrency && sendAmount && receiveAmount) {
      updateFormData({
        fromCurrency,
        toCurrency,
        sendAmount,
        receiveAmount,
        receivingOption: 'bank_account',
      });
      onNext();
    }
  };

  const getCountryData = (currencyCode: string) => {
    return currencies.find((c) => c.currency === currencyCode);
  };

  return (
    <Box className="currency-selection-step">
      <Typography variant="h6" className="step-title" sx={{ mb: 2 }}>
        Enter Transfer Details
      </Typography>

      {selectedBeneficiary && (
        <Box sx={{ mb: 3, p: 2, borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Sending to: <strong>{selectedBeneficiary.name}</strong> in{' '}
            <strong>{selectedBeneficiary.country}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Account: {selectedBeneficiary.accountNumber}
          </Typography>
        </Box>
      )}

      {/* Main Transfer Card */}
      <Box sx={{ p: 2, mb: 3, borderRadius: 2 }} className="currency-details">
        {/* Guaranteed Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            p: 1,
            borderRadius: 1,
          }}
        >
          <Box sx={{ mr: 1, fontSize: 16 }}>🔒</Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Guaranteed for 24h
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton size="small" onClick={handleSwapCurrencies}>
              <ArrowUpDown size={16} />
            </IconButton>
          </Box>
        </Box>

        {/* You Send Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
            You send exactly
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 2,
                minWidth: '120px',
              }}
            >
              {getCountryData(fromCurrency) && (
                <Flag
                  code={getCountryData(fromCurrency)?.flagCode}
                  height="20"
                  style={{ marginRight: 8 }}
                />
              )}
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.currency}>
                      {currency.currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton size="small" onClick={handleSwapCurrencies}>
                <ArrowUpDown size={16} />
              </IconButton>
            </Box>
            <TextField
              type="number"
              value={sendAmount}
              onChange={(e) => handleSendAmountChange(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                ml: 'auto',
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2e7d32',
                  textAlign: 'right',
                },
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Recipient Gets Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
            Recipient gets
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 2,
                minWidth: '120px',
              }}
            >
              {getCountryData(toCurrency) && (
                <Flag
                  code={getCountryData(toCurrency)?.flagCode}
                  height="20"
                  style={{ marginRight: 8 }}
                />
              )}
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.currency}>
                      {currency.currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton size="small" onClick={handleSwapCurrencies}>
                <ArrowUpDown size={16} />
              </IconButton>
            </Box>
            <TextField
              type="number"
              value={receiveAmount}
              onChange={(e) => handleReceiveAmountChange(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                ml: 'auto',
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2e7d32',
                  textAlign: 'right',
                },
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Payment Method Section */}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Building2 size={20} style={{ marginRight: 8 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.primary">
              Paying with
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Bank transfer
            </Typography>
          </Box>
          <Chip
            label="Change"
            size="small"
            sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}
          />
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Charges will be paid by section */}

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.text.primary, marginBottom: '16px' }}
          >
            OCBC Singapore and other bank's{' '}
            <CommonTooltip
              title={
                <div style={{ whiteSpace: 'pre-line' }}>
                  You (OUR) – OCBC Singapore & other banks' charges to be paid
                  by You.
                  {'\n\n'}Recipient (BEN) – OCBC Singapore & other banks' charges
                  to be paid by Recipient.
                  {'\n\n'}Both (SHA) – OCBC Singapore charges to be paid by You,
                  other banks' charges to be paid by Recipient.
                </div>
              }
            >
              <span
                style={{
                  color: '#ff5722',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                charges
              </span>
            </CommonTooltip>
            will be paid by
          </Typography>
          <RadioGroup
            value={chargesPaidBy}
            onChange={(e) => setChargesPaidBy(e.target.value)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              value="OUR"
              control={
                <Radio
                  sx={{
                    color: theme.palette.text.secondary,
                    '&.Mui-checked': {
                      color: '#483594',
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  You (OUR)
                </Typography>
              }
            />
            <FormControlLabel
              value="BEN"
              control={
                <Radio
                  sx={{
                    color: theme.palette.text.secondary,
                    '&.Mui-checked': {
                      color: '#483594',
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  Recipient (BEN)
                </Typography>
              }
            />
            <FormControlLabel
              value="SHA"
              control={
                <Radio
                  sx={{
                    color: theme.palette.text.secondary,
                    '&.Mui-checked': {
                      color: '#483594',
                    },
                  }}
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  Both (SHA)
                </Typography>
              }
            />
          </RadioGroup>
        </Box>

        <Divider sx={{ my: 2 }} />
        {/* Arrival Time Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Clock size={20} style={{ marginRight: 8 }} />
          <Box>
            <Typography variant="body2" color="text.primary">
              Arrives
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              by Thursday
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Total Fees Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Receipt size={20} style={{ marginRight: 8 }} />
            <Box>
              <Typography variant="body2" color="text.primary">
                Total fees
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Included in {fromCurrency} amount
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, textDecoration: 'underline' }}
            >
              {fee} {fromCurrency}
            </Typography>
            <IconButton size="small">
              <ArrowUpDown size={16} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box className="step-actions" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomButton
              onClick={onPrevious}
              fullWidth
              className="continue-button"
            >
              Back
            </CustomButton>
          </Grid>
          <Grid item xs={6}>
            <CustomButton
              onClick={handleContinue}
              disabled={
                !fromCurrency || !toCurrency || !sendAmount || !receiveAmount
              }
              fullWidth
              className="continue-button"
            >
              Continue
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CurrencySelectionStep;
