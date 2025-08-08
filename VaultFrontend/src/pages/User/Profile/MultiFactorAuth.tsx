import React from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { useAppToast } from '../../../utils/Toast';
import api from '@/helpers/apiHelper';
const url = import.meta.env.VITE_NODE_ENV === 'production' ? 'api' : 'api';

const MultiFactorAuth = () => {
  const toast = useAppToast();

  // Click Handler
  const handleSwitchMFA = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No token found in localStorage');
        return;
      }

      // API POST call
      const res = await api.post(
        `${url}/mfa/enable`,
      );
      // Success
      toast.success(res.data?.message || 'MFA authorization switch successful!');
      console.log('Switch MFA API response:', res.data);
    } catch (err) {
      let errorMsg = 'Something went wrong!';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
      console.error('Switch MFA API error:', err?.response?.data || err.message);
    }
  };

  return (
    <Box className="MultiFactorAuth-container">

      <Typography variant="h6" className="MultiFactorAuth-title" onClick={handleSwitchMFA} component="span"
        sx={{ color: "#7156d1", textDecoration: 'underline', cursor: 'pointer', marginTop:'2', '&:hover': { color: "#4b2999", textDecoration: 'underline', opacity: 0.8
          }, transition: 'color 0.2s' }} >
        Switch to MultiFactorAuthorization
      </Typography>
      
    </Box>
  );
};

export default MultiFactorAuth;
