import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInputField';
import CustomPassword from '@/components/CustomPasswordField';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
  useTheme,
} from '@mui/material';
import CommonTooltip from '@/components/common/toolTip';

const UserSignup = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    emailConfirmCode: '',
    termsAndConditionsConfirmed: false,
    termsAndConditionsVersion: 1,
    userType: 'CUSTOMER',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');

    try {
      const response = await axios.post(
        `${url}/customer/signup`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log(' Vault signup successful:', response.data);

      setStep(2);
    } catch (err: any) {
      console.error(
        '❌ Vault signup failed:',
        err.response?.data || err.message
      );
      const message = err.response?.data?.message || 'Something went wrong';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');

    try {
      const response = await axios.post(
        `${url}/customer/confirm`,
        {
          email: formData.email,
          password: formData.password,
          emailConfirmCode: formData.emailConfirmCode,
          termsAndConditionsConfirmed: formData.termsAndConditionsConfirmed,
          termsAndConditionsVersion: formData.termsAndConditionsVersion,
          userType: formData.userType,
        }
      );

      console.log(' Vault signup confirmation success:', response.data);
      navigate('/login');
    } catch (err: any) {
      console.error(
        ' Vault signup confirmation failed:',
        err.response?.data || err.message
      );
      const message =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Something went wrong';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };
  const isStep1Valid = formData.email !== '' && formData.password !== '';
  const isStep2Valid =
    formData.emailConfirmCode.trim() !== '' &&
    formData.termsAndConditionsConfirmed;

  return (
    <Box className="signup-container">
      <Box className="left-container" />
      <Box className="right-container">
        <Box className="signup-box">
          <Typography variant="h5" className="signup-title" sx={{ color: theme.palette.navbar.text }} >
            Welcome to Quick Cash
          </Typography>
          <Typography variant="body1" className="signup-subtitle" sx={{ color: theme.palette.text.gray }} >
            Register your account
          </Typography>

            <Typography variant="body2" sx={{ color: theme.palette.text.gray, mb: 3 }}>
                Please ensure that if you use uppercase letters in your email, they must match the exact case during login.
              </Typography>
          {step === 1 ? (
            <form className="signup-form" onSubmit={handleStep1Submit}>
              <CustomInput name="email" label="Email Address" type="email" fullWidth value={formData.email} onChange={handleChange} InputLabelProps={{ shrink: true }} autoComplete="new-email" required />

              <CustomPassword name="password" label="Password" type="password" fullWidth value={formData.password} onChange={handleChange} autoComplete="new-password" required/>
              {apiError && (
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  {apiError}
                </Typography>
              )}
              <CustomButton type="submit" fullWidth loading={loading} disabled={!isStep1Valid}>
                Sign Up
              </CustomButton>
            </form>
          ) : (
            <form className="signup-form" onSubmit={handleFinalSubmit}>
             
              <CustomInput name="email" label="Email Address" type="email" fullWidth value={formData.email} InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />

              <CustomPassword name="password" label="Password" type="password" fullWidth value={formData.password} InputProps={{ readOnly: true }} />

              <CustomInput name="emailConfirmCode" label="Email Confirmation Code" type="text" fullWidth value={formData.emailConfirmCode} onChange={handleChange} required />

              <CustomInput name="userType" label="User Type" select fullWidth value={formData.userType} onChange={handleChange} required >
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="BUSINESS">Business</MenuItem>
              </CustomInput>

              <FormControlLabel control={ <Checkbox name="termsAndConditionsConfirmed" checked={formData.termsAndConditionsConfirmed} onChange={handleChange} required /> } label="I agree to the Terms and Conditions"/>
              {apiError && (
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  {apiError}
                </Typography>
              )}

              <CustomButton type="submit" fullWidth loading={loading} disabled={!isStep2Valid} >
                Complete Signup
              </CustomButton>
            </form>
          )}

          <Box className="form-footer">
            <Typography variant="body2" sx={{ color: theme.palette.text.gray }}>
              Already have an account?{' '}
              <Link to="/login" className="signin-link" style={{ color: theme.palette.navbar.text }}>
                Sign in instead
              </Link>
            </Typography>
            <Typography variant="caption" className="copyright-text" sx={{ color: theme.palette.text.gray }} >
              © Quick Cash 2025.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserSignup;
