import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // For error handling
import { Box, Typography } from '@mui/material';
import GenericTable from '@/components/common/genericTable';

const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const CurrencyDataPage = () => {
  const [instrumentData, setInstrumentData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch currency data when the component mounts
  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token not found in localStorage');
          return;
        }

        const response = await axios.get(`${url}/currency/instruments-all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response:', response.data);

        setInstrumentData(response.data.data || []);
      } catch (error) {
        console.error('Error fetching currency data:', error);
        toast.error('Error fetching currency data');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchCurrencyData();
  }, []); // Empty dependency array ensures this runs only once on mount




  const columns = [
    { field: 'baseCurrencySlug', headerName: 'Base Currency SLUG' },
    { field: 'quoteCurrencySlug', headerName: 'Quote Currency SLUG' },
    { field: 'price', headerName: 'Price' },
  ];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className="dashboard-container">
      <GenericTable columns={columns} data={instrumentData} />
    </Box>
  );
};

export default CurrencyDataPage;
