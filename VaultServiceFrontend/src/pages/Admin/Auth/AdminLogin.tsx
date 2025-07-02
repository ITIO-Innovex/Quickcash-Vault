import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInputField';
import { useSettings } from '@/contexts/SettingsContext';
import CustomPassword from '@/components/CustomPasswordField';
import ForgotPasswordModal from '@/modal/forgotPasswordModal';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';

const AdminLogin = () => {
 const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useSettings();
  const [forgotOpen, setforgotOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <Box className="login-container">
      <Box className="login-left-container">
        
      </Box>

      <Box className="login-right-container">
        <Box className="back-to-home" onClick={() => navigate('/')}>
                  <ArrowBackIosNewIcon className="back-arrow-icon" />
                  <span>Back to Home</span>
                </Box>
        
        <Box className="theme-toggle">
          <IconButton onClick={toggleTheme} color="inherit">
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <Box className="login-box">
          <Typography
            variant="h5"
            className="login-title"
            sx={{ color: (theme) => theme.palette.navbar.text }}
          >
            Welcome Back Admin
          </Typography>
          <Typography variant="body1"className="login-subtitle" style={{ color: theme.palette.text.gray }}>
            Sign-in to your account and start the journey
          </Typography>

          <form className="login-form">
            <CustomInput
              name="email"
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
            />
            <CustomPassword
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
            />
            <Box className="remember-forgot-container">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Remember me"
                className="remember-label"
              />
              <Link
                to="/forgot-password"
                className="forgot-link"
                style={{ color: theme.palette.navbar.text }}
                onClick={() => setforgotOpen(true)}
              >
                Forgot password?
              </Link>
              <ForgotPasswordModal
                open={forgotOpen}
                onClose={() => setforgotOpen(false)}
              />
            </Box>
            <CustomButton
              type="submit"
              fullWidth
              loading={loading}
              onClick={handleSubmit}
            >
              SIGN IN
            </CustomButton>
          </form>

          <Box className="login-form-footer" style={{ color: theme.palette.text.gray }}>
            <p>
              New on our platform?{' '}
              <a href="/register" className="signup-link" style={{ color: theme.palette.navbar.text }}>
                Create an account
              </a>
            </p>
            <Typography variant="caption" className="copyright-text" style={{ color: theme.palette.text.gray }}>
              © Quick Cash 2025.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default AdminLogin
