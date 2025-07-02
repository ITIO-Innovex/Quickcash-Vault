import axios from 'axios';
import { useAppToast } from '../utils/Toast';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface StateOption {
  code: string;
  name: string;
}

interface StateDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
}

const StateDropdown: React.FC<StateDropdownProps> = ({ value, onChange, label = 'State', fullWidth = true }) => {
  const theme = useTheme();
  const toast = useAppToast();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<StateOption[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('You must be logged in to fetch states');
          return;
        }
        setLoading(true);

        const response = await axios.get('http://localhost:5000/api/countries/all-states', {
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
        });

        console.log('States fetched:', response.data);
        setStates(response.data?.data || []);
      } catch (error: any) {
        toast.error('Failed to fetch states');
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size="small" sx={{ mt: 2 }}>
      <InputLabel id="state-label" sx={{ color: theme.palette.text.primary }}>{label}</InputLabel>
      <Select
        labelId="state-label"
        value={value}
        onChange={handleChange}
        label={label}
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
        {loading ? (
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
  );
};

export default StateDropdown;
