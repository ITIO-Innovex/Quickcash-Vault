import axios from 'axios';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, TextField } from '@mui/material';
import CustomButton from '../../../components/CustomButton';
import CustomPassword from '@/components/CustomPasswordField';
const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const SecurityForm = () => {
  const theme = useTheme();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(''));  

  
  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token'); 

    const response = await axios.post(
      `${url}/customer/password/change`,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Password updated successfully:', response.data);
    setSubmitted(true);
    setErrorMsg('');

  } catch (error: any) {
    const msg = error?.response?.data?.message || 'Something went wrong.';
    setErrorMsg(msg);
    console.error('Error updating password:', msg);
  }
};
const handleDigitChange = (value: string, index: number) => {
  if (!/^[0-9]?$/.test(value)) return;

  const newDigits = [...codeDigits];
  newDigits[index] = value;
  setCodeDigits(newDigits);

  // Auto focus next input
  if (value && index < 5) {
    const nextInput = document.getElementById(`digit-${index + 1}`);
    nextInput?.focus();
  }

  setConfirmationCode(newDigits.join(''));
};

  const handleConfirm = async () => {
  try {
    const token = localStorage.getItem('token'); 

    const response = await axios.post(
      `${url}/customer/password/change/confirm`,
      {
        oldPassword,
        newPassword,
        confirmCode: confirmationCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log('Password change confirmed:', response.data);
     setSuccessMsg('Password changed successfully');

      // Reset fields
    setOldPassword('');
    setNewPassword('');
    setConfirmationCode('');
    setCodeDigits(Array(6).fill(''));
    setSubmitted(false); // so it hides confirmation block again (optional)

    //clear message after few seconds
    setTimeout(() => setSuccessMsg(''), 5000);
  } catch (error) {
    console.error('Error confirming password change:', error?.response?.data || error);
  }
};


  return (
    <Box
      sx={{ p: 3, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, }} >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Change Password
      </Typography>

      <Box sx={{ maxWidth: 600 }}>
        <Box sx={{ mb: 3 }}>
          <CustomPassword fullWidth label="Old Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} disabled={submitted} variant="outlined" sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default,
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: '#483594',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#483594',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <CustomPassword fullWidth label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={submitted} variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default,
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: '#483594',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#483594',
                },
              },
            }}
          />
        </Box>
            {errorMsg && (
          <Typography variant="body2" sx={{ color: 'red', mb: 2 }}>
            {errorMsg}
          </Typography>
        )}

        {!submitted && (
          <CustomButton onClick={handleSubmit}>SUBMIT</CustomButton>
        )}
           {successMsg && (
            <Typography variant="body2" sx={{ color: 'green', mb: 2 }}>
              {successMsg}
            </Typography>
          )}
        {submitted && (
          <>
            <Box sx={{ mt: 4, mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 3, fontWeight: 'bold' }}>
                Confirmation Code
              </Typography>

              <div className="code-input-container">
                {codeDigits.map((digit, index) => (
                  <input key={index} id={`digit-${index}`}type="text" inputMode="numeric" maxLength={1} value={digit} className="code-input" onChange={(e) => handleDigitChange(e.target.value, index)}onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>
            </Box>
            <CustomButton onClick={handleConfirm}>Change Password</CustomButton>
            
          </>
        )}
      </Box>
    </Box>
  );
};

export default SecurityForm;
