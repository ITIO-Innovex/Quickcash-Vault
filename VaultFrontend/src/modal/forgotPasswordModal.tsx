import axios from 'axios';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import successAnim from '../assets/Success.json';
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInputField';
import { useSettings } from '@/contexts/SettingsContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { isValidateEmail, isEmpty, isValidPassword } from '@/utils/validator';
import { Typography, Modal, IconButton, Box, useTheme } from '@mui/material';
import CustomPassword from '@/components/CustomPasswordField';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ForgconfirmCodeasswordModal: React.FC<Props> = ({ open, onClose }) => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useSettings();
  const navigate = useNavigate();
  const [confirmCode, setconfirmCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

  const handleContinue = async () => {
    setError("");
    if (step === 1) {
      if (isEmpty(email)) return setError('Email is required');
      if (!isValidateEmail(email)) return setError ('Enter a valid email');
      try {
        localStorage.setItem('resetEmail', email); // Save email in localStorage
        const response = await axios.post(
          `${url}/customer/password/reset`,
          
           { email }, 
           {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.status !== 200) {
          setError(response.data?.message || 'Failed to send confirmCode');
          return;
        }
        console.log("confirmCode sent to:", email, response.data);
        setStep(2);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to send confirmCode');
        console.error(err);
      }
    } else if (step === 2) {
  if (isEmpty(confirmCode)) return setError('Confirm code is required');

  try {
    const email = localStorage.getItem('resetEmail') || '';
    if (!email) {
      setError('Email not found. Please restart the password reset process.');
      return;
    }

    const response = await axios.post(
      `${url}/customer/password/reset/confirm`,

      { email, confirmCode, },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;
    if (response.status !== 200 || !data.success) {
      setError(data.message || 'Confirm code verification failed');
      return;
    }

    // Store the payload for the final reset
    if (data.data?.payload) {
      localStorage.setItem('resetPayload', data.data.payload);
    }

    setStep(3);
  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.message || 'Failed to verify confirm code');
  }
    }
  };

 const handleSubmit = async () => {
  setError('');

  if (isEmpty(newPassword)) return setError('Password is required');
  if (!isValidPassword(newPassword)) return setError('Password must be at least 6 characters');

  const email = localStorage.getItem('resetEmail');
  const payload = localStorage.getItem('resetPayload');

  if (!email || !payload) {
    setError('Missing reset information. Please restart the process.');
    return;
  }

  try {
    const response = await axios.post(
      `${url}/customer/password/reset/execute`,

      { email, newPassword, payload, },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

   if (response.status === 200 && response.data?.success) {
  console.log('✅ Password reset successful');
  setShowSuccess(true); // This will trigger countdown logic
  setCountdown(5); // Reset countdown timer to 5
} else {
  setError(response.data?.message || 'Password reset failed');
}
  } catch (err: any) {
    console.error('❌ Error resetting password:', err);
    setError(err.response?.data?.message || 'Failed to reset password');
  }
};

const [countdown, setCountdown] = useState(5);

useEffect(() => {
  if (showSuccess && countdown > 0) {
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }

  if (showSuccess && countdown === 0) {
    setShowSuccess(false);
    onClose();
    navigate('/login'); // Redirect destination
  }
}, [showSuccess, countdown]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-container" sx={{ backgroundColor: (theme) => theme.palette.background.paper }} >
         <Box className='t-icon'>
        <IconButton onClick={toggleTheme} color="inherit">
           {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
        {showSuccess ? (
      <Box className="success-animation-wrapper">
        <Lottie animationData={successAnim} loop={false} style={{ width: 120, height: 120 }} />
        <Typography className="modal-heading" style={{ textAlign: 'center' }} sx={{ color: (theme) => theme.palette.navbar.text }} >
          Password Reset Successfully!
        </Typography>
        <Typography sx={{ mt: 2, fontSize: '16px', textAlign: 'center' }}>
          Redirecting to dashboard in {countdown}...
        </Typography>
      </Box>
    ) : (
      <>

        <IconButton aria-label="close" onClick={onClose} className="modal-close">
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" className="modal-heading" sx={{ color: (theme) => theme.palette.navbar.text }}>
          Forgot Password
        </Typography>

        <Typography className="modal-subtext">
          {step === 1 && "Enter your registered email to receive an confirmCode"}
          {step === 2 && "Enter the confirmCode we've sent to your email"}
          {step === 3 && "Enter your new password"}
        </Typography>

        {step === 1 && (
          <CustomInput fullWidth className="modal-input" required label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} error={!!error} helperText={step === 1 && error}/>
        )}

        {step === 2 && (
          <CustomInput fullWidth className="modal-input" label="Enter confirmCode" variant="outlined" value={confirmCode} onChange={(e) => setconfirmCode(e.target.value)}  error={!!error} helperText={step === 2 && error}/>
        )}

        {step === 3 && (
          <CustomPassword fullWidth className="modal-input" required label="New Password" type="password" variant="outlined" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  error={!!error} helperText={step === 3 && error}/>
        )}

        {step < 3 ? (
          <CustomButton variant="contained" className="modal-btn" onClick={handleContinue} fullWidth>
            {step === 1 ? 'Continue' : 'Verify confirmCode'}
          </CustomButton>
        ) : (
          <CustomButton variant="contained" className="modal-btn" onClick={handleSubmit} fullWidth>
            Submit
          </CustomButton>
        )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ForgconfirmCodeasswordModal;
