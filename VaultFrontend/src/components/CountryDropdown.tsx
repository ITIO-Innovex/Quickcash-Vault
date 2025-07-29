import axios from 'axios';
import { useAppToast } from '../utils/Toast';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface CountryOption {
  isoCode2: string;
  isoCode3: string;
  name: string;
}

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({ value, onChange, label = 'Country', fullWidth = true }) => {

  const theme = useTheme();
  const toast = useAppToast();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token){
          toast.error('Yoy must be logged in to fetch countries');
          return;
        }
        setLoading(true);

        const response = await axios.get('http://localhost:5000/api/countries/all', {
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          }
        });
        console.log('Countries fetched:', response.data);
        setCountries(response.data.data || []);
      } catch (error: any) {
        toast.error('Failed to fetch countries');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size="small" sx={{ mt: 2 }}>
      <InputLabel id="country-label" sx={{ color: theme.palette.text.primary }}>{label}</InputLabel>
      <Select labelId="country-label" value={value} onChange={handleChange} label={label}
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
          countries.map((country) => (
            <MenuItem key={country.isoCode2} value={country.isoCode2}>
              {country.name} ({country.isoCode2})
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default CountryDropdown;
