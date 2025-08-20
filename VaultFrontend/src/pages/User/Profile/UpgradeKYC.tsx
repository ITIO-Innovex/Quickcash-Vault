import axios from 'axios';
import CustomModal from '@/components/CustomModal';
import { useEffect, useRef, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import GenericTable from '@/components/common/genericTable';
import { Box, Typography, CircularProgress } from '@mui/material';
import SumsubPOA from './SumsubPOA';

const UpgradeKYC = () => {
  const [loading, setLoading] = useState(true);
  const [sdkToken, setSdkToken] = useState(null);
  const [showSdk, setShowSdk] = useState(false);  
  const [modalOpen, setModalOpen] = useState(false);
  const [sumsubData, setSumsubData] = useState(null);
  const [sumsubStatus, setSumsubStatus] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

  const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Format as "DD MMM YYYY", e.g., "13 Feb 2006"
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

  useEffect(() => {
    const fetchSumsubStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${url}/kyc/sumsub/data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSumsubData(res.data.data.info);
        setSumsubStatus(res.data.data.status);
      } catch (error) {
        console.error('Error fetching Sumsub status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSumsubStatus();
  }, []);

  const handleStartVerification = async () => {
  try {
    setButtonLoading(true);
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/kyc/sumsub/token-upgrade', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const upgradeToken = res.data.data.token;
    console.log('Sumsub upgrade token response:', upgradeToken);
    // Set SDK token and show SDK section
    setSdkToken(upgradeToken);
    setShowSdk(true);
    // Optionally close the modal OR keep open for user info
    setModalOpen(false);
    
  } catch (error) {
    console.error('Error upgrading Sumsub token:', error);
  } finally {
   setButtonLoading(false);
  }
  };

  const rowData = {
    dob: sumsubData?.dob || '',
    documentNumber: sumsubData?.documentNumber || '',
    documentType: sumsubData?.documentType || '',
    expirationDate: sumsubData?.expirationDate || '',
    nationality: sumsubData?.nationality || '',
    taxResidency: sumsubData?.taxResidency || '',
    status: sumsubStatus || '',
  };

  const columns = [
    { field: 'status', headerName: 'Status' },
    { field: 'documentType', headerName: 'DocumentType' },
    { field: 'documentNumber', headerName: 'DocumentNumber' },
    { field: 'dob', headerName: 'DOB', render: row => formatDate(row.dob) },
    { field: 'expirationDate', headerName: 'Expiry Date', render: row => formatDate(row.expirationDate) },
    { field: 'nationality', headerName: 'Nationality' },
    { field: 'taxResidency', headerName: 'Tax Residency' },
    { field: 'kyc', headerName: 'Kyc (POA)', render: (row) => (
    <span style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setModalOpen(true); }}>
      {row.status === 'ADDRESS_DENIED' ? 'Resubmit' : 'Upgrade'}
    </span>
        )
    }
  ];


  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography>Loading Sumsub verification status...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <GenericTable columns={columns} data={[rowData]} />

     <CustomModal open={modalOpen} onClose={() => setModalOpen(false)} disableBackdropClick={true} title="Upgrade KYC POA">
      <CustomButton onClick={handleStartVerification} loading={buttonLoading} disabled={buttonLoading}>
        {buttonLoading ? 'Starting...' : 'Start Verification POA'}
      </CustomButton>
    </CustomModal>
    {showSdk && sdkToken && (
      <CustomModal open={true} onClose={() => setShowSdk(false)} title="KYC Verification">
        <SumsubPOA token={sdkToken} />
      </CustomModal>
    )}
    </Box>
  );
};

export default UpgradeKYC;
