import { useState } from 'react';
import { Box, MenuItem, Typography, useTheme } from '@mui/material';
import CustomInput from '@/components/CustomInputField';
import CustomButton from '../CustomButton';

interface Props {
  onClose: () => void;
}

const coinOptions = [
  { label: 'AC Milan ($CHZ)', value: 'ac-milan', network: 'ERC20' },
  { label: 'AS Roma ($CHZ)', value: 'as-roma', network: 'ERC20' },
  { label: 'Atlético de Madrid ($CHZ)', value: 'atm', network: 'ERC20' },
];

const CreateCoinForm: React.FC<Props> = ({ onClose }) => {
  const theme = useTheme();
  const [SelectedCoin, setSelectedCoin] = useState('');

  const handleSubmit = () => {
    const selectedCoinData = coinOptions.find((coin) => coin.value === SelectedCoin);
    console.log({ SelectedCoin, coin: selectedCoinData });
    onClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Select a Coin to Add
      </Typography>

      <CustomInput
        select
        label="Select a Coin"
        fullWidth
        value={SelectedCoin}
        onChange={(e) => setSelectedCoin(e.target.value)}
      >
        {coinOptions.map((coin) => (
          <MenuItem key={coin.value} value={coin.value}>
            <Box>
              <Box>{coin.label}</Box>
              <Box sx={{ fontSize: '0.75rem', color: 'gray' }}>{coin.network}</Box>
            </Box>
          </MenuItem>
        ))}
      </CustomInput>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <CustomButton onClick={handleSubmit}>Ok</CustomButton>
        <CustomButton onClick={onClose}>Close</CustomButton>
      </Box>
    </Box>
  );
};

export default CreateCoinForm;
