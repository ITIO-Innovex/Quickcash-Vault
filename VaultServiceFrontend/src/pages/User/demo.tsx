import axios from 'axios';
import { useAppToast } from '../../utils/Toast';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Box, Typography } from '@mui/material';
import CountryDropdown from '../../components/CountryDropdown';

interface StateOption {
  code: string;
  name: string;
}

const Demo = () => {
  const theme = useTheme();
  const toast = useAppToast();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [loadingStates, setLoadingStates] = useState(false);
  const [states, setStates] = useState<StateOption[]>([]);

useEffect(() => {
  const fetchStates = async () => {
    if (!selectedCountry) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to fetch states');
        return;
      }
      setLoadingStates(true);

      const response = await axios.get('http://localhost:5000/api/countries/all-states', {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      });

      const allStates = response.data?.data || [];

      // 🔍 Filter by selected country ISO
      const matchedCountry = allStates.find(
        (item: any) => item.countryIsoCode2 === selectedCountry
      );

      setStates(matchedCountry?.states || []);
    } catch (error: any) {
      toast.error('Failed to fetch states');
    } finally {
      setLoadingStates(false);
    }
  };

  fetchStates();
}, [selectedCountry]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Your Country
      </Typography>

      <CountryDropdown
        value={selectedCountry}
        onChange={(val) => {
          setSelectedCountry(val);
          setSelectedState('');
          setStates([]);
        }}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Select Your State
      </Typography>

      <FormControl fullWidth size="small">
        <InputLabel id="state-label" sx={{ color: theme.palette.text.primary }}>State</InputLabel>
        <Select
          labelId="state-label"
          value={selectedState}
          onChange={(e: SelectChangeEvent) => setSelectedState(e.target.value)}
          label="State"
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {loadingStates ? (
            <MenuItem value="" disabled>
              Loading...
            </MenuItem>
          ) : (
            states.map((state) => (
              <MenuItem key={state.code} value={state.code}>
                {state.name} ({state.code})
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      <Typography sx={{ mt: 3 }}>
        Selected: {selectedCountry || 'None'} - {selectedState || 'None'}
      </Typography>
    </Box>
  );
};

export default Demo;
