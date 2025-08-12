import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GenericTable from '@/components/common/genericTable'; 
const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

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

        const response = await axios.get(`${url}/blockchain/token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Response data:', response.data);
       console.log('API Response:', response.data); // Check the structure of the response

        // Since response.data is an array, we can map over it to extract necessary fields
        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          blockchainSlug: item.blockchainSlug,
          currency: {
            id: item.currency?.id,
            type: item.currency?.type,
          },
          blockchain: {
            id: item.blockchain?.id,
            name: item.blockchain?.name,
            explorer: item.blockchain?.explorer,
          },
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

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'slug', headerName: 'Slug' },
    { field: 'blockchainSlug', headerName: 'Blockchain Slug' },
    {
      field: 'currency',
      headerName: 'Currency ',
      render: (row) => (
        <span>
           {row.currency?.type} 
        </span>
      ),
    },
    {
      field: 'blockchain',
      headerName: 'Blockchain',
      render: (row) => (
        <span>
          {row.blockchain?.name} -{' '}
          <a href={row.blockchain?.explorer} target="_blank" rel="noopener noreferrer">
            Explorer
          </a>
        </span>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GenericTable columns={columns} data={data} />
    </div>
  );
};

export default FirstSection;
