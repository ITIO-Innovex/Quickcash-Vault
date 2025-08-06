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

        const response = await axios.get(`${API_URL}/blockchain/summary-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response data:', response.data);
        // Directly map the response to include the needed fields
        const formattedData = response.data.data.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          blockchainSlug: item.blockchainSlug,
          currencyId: item.currency.id,
          currencyType: item.currency.type,
          currencyDecimals: item.currency.decimals,
          currencyIcon: item.currency.iconUrl,
          blockchainName: item.blockchain.name,
          blockchainId: item.blockchain.id,
        }));
        setData(formattedData);
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

  const columns = [
    {
      field: 'currencyIcon',
      headerName: 'Currency Icon',
      render: (row) => <img src={row.currencyIcon} alt={row.name} style={{ width: 30, height: 30 }} />,
    },
    { field: 'id', headerName: 'ID' },
    { field: 'currencyId', headerName: 'Currency ID' },
    { field: 'blockchainId', headerName: 'BlockchainID' },
    { field: 'name', headerName: 'Name' },
    { field: 'blockchainName', headerName: 'Blockchain Name' },
    { field: 'slug', headerName: 'Slug' },
    { field: 'blockchainSlug', headerName: 'Blockchain Slug' },
    { field: 'currencyType', headerName: 'Currency Type' },
    { field: 'currencyDecimals', headerName: 'Currency Decimals' },
  ];

  return (
    <Box>
      <GenericTable columns={columns} data={data} />
    </Box>
  );
};

export default FirstSection;
