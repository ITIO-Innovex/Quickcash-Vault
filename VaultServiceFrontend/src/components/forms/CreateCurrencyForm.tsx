import React, { useState } from 'react';
import CustomButton from '../CustomButton';
import CustomInput from '@/components/CustomInputField';
import { Box, Typography, Divider, useTheme } from '@mui/material';

interface Props {
  onClose: () => void;
}

const CreateCurrencyForm: React.FC<Props> = ({ onClose }) => {
  const theme = useTheme();
  const [currencyName, setCurrencyName] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');

  const handleSubmit = () => {
    const data = { currencyName,currencyCode };
    console.log('Submitted:', data);
    onClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* User Field */}
        <CustomInput
        label="CurrencyName"
        fullWidth
        value={currencyName}
        onChange={(e) => setCurrencyName(e.target.value)}
      ></CustomInput>

       <CustomInput
        label="CurrencyCode"
        fullWidth
        value={currencyCode}
        onChange={(e) => setCurrencyCode(e.target.value)}
      ></CustomInput>
      {/* Buttons */}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <CustomButton onClick={onClose}>Close</CustomButton>
      </Box>
    </Box>
  );
};

export default CreateCurrencyForm;
