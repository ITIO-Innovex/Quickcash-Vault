import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import GenericTable from '../../../components/common/genericTable';
import axios from 'axios';
import { useAppToast } from '../../../utils/Toast';
import dayjs from 'dayjs';

const getCurrentBrowserOS = () => {
  const ua = navigator.userAgent.toLowerCase();

  let browser = 'Unknown';
  let os = 'Unknown';

  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';

  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone')) os = 'iOS';

  return { browser, os };
};

const LoginHistory = () => {
  const theme = useTheme();
  const toast = useAppToast();
  const [loginData, setLoginData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: 'date', headerName: 'DATE & TIME' },
    { field: 'browser', headerName: 'BROWSER' },
    { field: 'os', headerName: 'OPERATING SYSTEM' },
    { field: 'ip', headerName: 'IP ADDRESS' },
  ];

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('You must be logged in to view login history.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/customer/all-sessions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sessionList = response?.data?.data || [];
        console.log('Session List:', sessionList);

        const currentInfo = getCurrentBrowserOS();

        const formatted = sessionList.map((item: any, index: number) => {
          const isLatest = index === 0; // Apply to most recent session only

          return {
            date: dayjs(item.createDate).format('MMM D, YYYY h:mm A'),
            browser: isLatest ? currentInfo.browser : 'Unknown',
            os: isLatest ? currentInfo.os : 'Unknown',
            ip: item.ip || '-',
          };
        });

        setLoginData(formatted);
      } catch (error: any) {
        const errMsg = error?.response?.data?.message || 'Failed to fetch login history.';
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, []);

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <GenericTable columns={columns} data={loginData} />
      )}
    </Box>
  );
};

export default LoginHistory;
