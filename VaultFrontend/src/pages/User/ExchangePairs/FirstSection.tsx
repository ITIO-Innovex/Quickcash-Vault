import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GenericTable from '@/components/common/genericTable';
import { Box } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FirstSection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }

        const response = await axios.get(`${API_URL}/blockchain/exchange-pairs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response data:', response.data);
        setData(response.data.data.exchangePairs || []); // Set the exchange pairs data

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Define columns for the GenericTable
  const columns = [
    { field: 'fromCurrencySlug', headerName: 'From Currency' },
    { field: 'toCurrencySlug', headerName: 'To Currency' },
    { field: 'minFromAmount', headerName: 'Min From Amount' },
    { field: 'maxFromAmount', headerName: 'Max From Amount' },
    { field: 'minToAmount', headerName: 'Min To Amount' },
    { field: 'maxToAmount', headerName: 'Max To Amount' },
    { field: 'rate', headerName: 'Rate' },
  ];

  // Render the data for the table
  const mappedData = data.map(item => ({
    fromCurrencySlug: item.fromCurrencySlug || 'N/A',
    toCurrencySlug: item.toCurrencySlug || 'N/A',
    minFromAmount: item.minFromAmount || 'N/A',
    maxFromAmount: item.maxFromAmount || 'N/A',
    minToAmount: item.minToAmount || 'N/A',
    maxToAmount: item.maxToAmount || 'N/A',
    rate: item.rate || 'N/A',
  }));

  return (
    <Box>
      <GenericTable columns={columns} data={mappedData} />
    </Box>
  );
};

export default FirstSection;
