import axios from 'axios';
import FirstSection from './FirstSection';
import { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import PageHeader from '@/components/common/pageHeader';

const Main = () => {
  const theme = useTheme();
  const [recurrentData, setRecurrentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${url}/subscription/invoices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const raw = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
            const recurrentInvoices = raw
        .filter((item) => item.type === 'RECURRENT')
        .map((item) => ({
          ...item,
          lastModifiedDate: item.linkedInvoices?.[0]?.lastModifiedDate || null,
        }));
        
        setRecurrentData(recurrentInvoices);
      } catch (err) {
        console.error('❌ Error fetching invoices:', err);
      }
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  return (
    <Box 
      className="clients-container dashboard-container" 
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <PageHeader title='Recurring Invoices' />
      <FirstSection 
        recurrentData={recurrentData} 
        loading={loading}
      />
    </Box>
  );
};

export default Main;
