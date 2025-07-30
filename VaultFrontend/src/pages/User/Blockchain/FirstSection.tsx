import React, { useEffect, useState } from 'react';
import api from '@/helpers/apiHelper';
import GenericTable from '@/components/common/genericTable';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'custodyName', headerName: 'CustodyName' },
  { field: 'name', headerName: 'Name' },
  { field: 'processor', headerName: 'Processor' },
  { field: 'slug', headerName: 'Slug' },
];

const FirstSection = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token not found in localStorage");
          return;
        }
        // API endpoint as per backend route
        const res = await api.get(`${API_URL}/blockchain/currencies/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If response has data, process it
        if (res.data && res.data.data) {
          // Sort the data by 'id' field in ascending order
          const sortedData = res.data.data.sort((a: any, b: any) => a.id - b.id);
          setData(Array.isArray(sortedData) ? sortedData : []);
        } else {
          setData([]);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch blockchain currencies');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <GenericTable columns={columns} data={data} />
    </div>
  );
};

export default FirstSection;
