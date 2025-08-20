import { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInputField';
import { useSettings } from '@/contexts/SettingsContext';
import CustomPassword from '@/components/CustomPasswordField';
import ForgotPasswordModal from '@/modal/forgotPasswordModal';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useAppToast } from '../../../utils/Toast';
import { useAuth } from '@/contexts/authContext';
import api from '@/helpers/apiHelper';

const UserLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { success, error, warning } = useAppToast();
  const [forgotOpen, setforgotOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const { login } = useAuth(); // ✅ Get login from context

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const device = navigator.userAgent || 'Unknown';
    const platform = navigator.platform || 'Unknown';

    const response = await api.post(`${url}/customer/login`, {
      email,
      password,
      device,
      platform,
    });

    const data = response.data;
    console.log('Login response:', data);
    // ✅ Call login from context
    login(data.ourToken);

    success("Login successful!");

    // ✅ Optional: delay navigation slightly to let context update
    setTimeout(() => {
      navigate('/dashboard');
    }, 100);
  } catch (err: any) {
  console.error('Login error:', err.response?.data || err.message);
  error(
    err.response?.data?.error?.message ||
    err.response?.data?.message ||
    'Login failed'
  );
}
finally {
    setLoading(false);
  }
};

  return (
    <Box className="login-container">
      <Box className="login-left-container">
        
      </Box>

      <Box className="login-right-container">
        <Box className="login-box">
          
          <Typography
            variant="h5"
            className="login-title"
            sx={{ color: (theme) => theme.palette.navbar.text }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1"className="login-subtitle" style={{ color: theme.palette.text.gray }}>
            Sign-in to your account and start the journey
          </Typography>

          <form className="login-form" onSubmit={handleLogin} autoComplete='off'>
            <CustomInput
            required
              name="email"
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="new-email"
            />

            <CustomPassword
            required
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Box className="remember-forgot-container">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Remember me"
                className="remember-label"
                sx={{ color: theme => theme.palette.text.primary }}
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

export default UserLogin;
