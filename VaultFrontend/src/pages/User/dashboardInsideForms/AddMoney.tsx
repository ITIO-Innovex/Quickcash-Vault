import { useState } from 'react';
import {TextField, MenuItem, Typography, Box, Button, useTheme} from '@mui/material';
import CountryDropdown from '@/components/CountryDropdown';
import CustomSelect from '@/components/CustomDropdown';
import CustomTextField from '@/components/CustomTextField';
import CustomInput from '@/components/CustomInputField';

interface AddMoneyFormProps {
  onClose: () => void;
}

const countryOptions = [
  { code: 'US', name: 'United States', currency: 'USD', flagCode: 'US' },
  { code: 'EU', name: 'European Union', currency: 'EUR', flagCode: 'EU' },
  { code: 'IN', name: 'India', currency: 'INR', flagCode: 'IN' },
];

const TransferOptions = [
  {
    label: 'Stripe - Supports USD, EUR and more',
    value: 'stripe',
  },
  {
    label: 'Paypal - Supports USD',
    value: 'paypal',
  },
];


const AddMoneyForm = ({ onClose }: AddMoneyFormProps) => {
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [transferType, setTransferType] = useState('stripe');

  const depositFee = 23;
  const finalAmount = amount ? parseFloat(amount) + depositFee : 0;
  const conversionAmount = finalAmount * 77.8;

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2} sx={{color:theme.palette.text.primary}}>
      <Box>
        <CountryDropdown
            label="Select Currency Type"
            countries={countryOptions}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as string)}
            size="small"
            showFlag={true}    
            showCurrency={true} 
            fullWidth
          />

      </Box>

      <Box>
        <CustomSelect
          label="Select Currency Type"
          value={transferType}
          onChange={(e) => setTransferType(e.target.value as string)}
          options={TransferOptions}
          size="small"
          fullWidth
        />

      </Box>

      <Box>
         <CustomInput label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />
      </Box>

      <Box>
        <Typography variant="body2" color="text.primary">
          Deposit Fee: <strong>${depositFee.toFixed(2)}</strong> &nbsp;
          Total: <strong>${finalAmount.toFixed(2)}</strong> &nbsp;
          Conversion: <strong>₹{conversionAmount.toFixed(2)}</strong>
        </Typography>
      </Box>

      <Button className='modal-button'
        variant="contained"      
        onClick={onClose}
      >
        Add Money
      </Button>
    </Box>
  );
};

export default AddMoneyForm;
