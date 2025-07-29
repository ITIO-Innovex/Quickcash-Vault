import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  loading = false,
  disabled,
  fullWidth = false,
  variant = 'contained',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      sx={{
        backgroundColor: 'rgb(72, 53, 148)',
        color: '#fff',
        transform: 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

        '&:hover': {
          backgroundColor: 'rgb(60, 44, 123)',
          transform: 'scale(1.05)',
        },
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            color: variant === 'contained' ? 'white' : 'primary.main',
          }}
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
