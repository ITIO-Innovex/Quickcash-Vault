import axios from 'axios';
import FiatCrypto from './FiatCrypto';
import { toast } from 'react-toastify';
import SumsubKYC from './SumsubKyc/main';
import { useEffect, useState } from 'react';
import DashboardStats from './StatsSection';
import CryptoSection from './CryptoSection';
import { useAuth } from '@/contexts/authContext'; 
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from '@/components/CustomButton';
import TransactionHistory from './TransactionHistoryCopyTable';
import PageHeader from '@/components/common/pageHeader';
import { Box, useTheme, Typography,CircularProgress} from '@mui/material';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

import CustomModal from '@/components/CustomModal';
import { c } from 'vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf';
const UserDashboard = () => {
  const theme = useTheme();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [showKycForm, setShowKycForm] = useState(false)
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);

  const fetchKycStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/customer/kyc-status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // console.log('KYC Status Response:', res.data);
      const reviewStatus = res.data?.status;
      if (reviewStatus === 'completed') {
        setKycStatus('completed');
      } else if (!reviewStatus || reviewStatus === 'pending') {
        setKycStatus('pending');
        setShowKycModal(true);
      }
    } catch (err: any) {
      console.error('KYC fetch error:', err?.response?.data || err.message);
      setShowKycModal(true); // If doc not found, show modal
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    logout();
    toast.success('Logout Successfully!');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, p: 4 }}>
      <PageHeader title="Dashboard" />

      {/* ✅ Show Custom Modal if pending or not found */}
      <CustomModal open={showKycModal} onClose={() => setShowKycModal(false)} title="KYC Required" maxWidth="sm">
      {!showKycForm ? (
        <>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Your KYC is {kycStatus === 'pending' ? 'under review.' : 'not started. Please complete it to continue.'}
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <CustomButton variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </CustomButton>
        <CustomButton onClick={() => setShowKycForm(true)}>
          Start KYC
        </CustomButton>
      </Box>
    </>
  ) : (
    <SumsubKYC />
  )}
</CustomModal>

      {/* ✅ Dashboard visible only if KYC is approved */}
      {kycStatus === 'completed' && (
        <>
          <DashboardStats />
          <CryptoSection />
          <FiatCrypto />
          <TransactionHistory />
        </>
      )}
    </Box>
  );
};

export default UserDashboard;