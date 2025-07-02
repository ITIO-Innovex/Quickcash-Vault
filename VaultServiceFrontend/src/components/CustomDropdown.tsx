
import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps as MuiSelectProps,
  useTheme,
} from '@mui/material';

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps extends Omit<MuiSelectProps, 'variant'> {
  label: string;
  options: Option[];
  variant?: 'outlined' | 'filled' | 'standard';
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  label, 
  options, 
  variant = 'outlined',
  ...props 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <FormControl fullWidth variant={variant}>
      <InputLabel
        sx={{
          color: isDark ? '#fff' : '#4a148c',
          '&.Mui-focused': {
            color: isDark ? '#fff' : '#4a148c',
          },
          '&.MuiInputLabel-shrink': {
            color: isDark ? '#fff' : '#4a148c',
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        label={label}
        variant={variant}
        {...props}
        sx={{
           height: 55, 
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? '#666' : '#ccc',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? '#aaa' : '#888',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? theme.palette.navbar.text : 'rgb(72, 53, 148)',
          },
          color: isDark ? '#fff' : '#000',
          '& .MuiSvgIcon-root': {
            color: isDark ? '#fff' : 'inherit',
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
