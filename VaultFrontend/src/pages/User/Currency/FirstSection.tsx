import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // For error handling
import { Box, Typography } from '@mui/material';
import GenericTable from '@/components/common/genericTable';

const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const CurrencyDataPage = () => {
  const [currencyData, setCurrencyData] = useState([]);
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

        const response = await axios.get(`${url}/currency/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response:', response.data);
         response.data.data.forEach((item, index) => {
        // console.log(`Transfer Fee for ${item.description} (Slug: ${item.slug}):`, item.settings?.transferFee);
      });
        setCurrencyData(response.data.data || []);
      } catch (error) {
        console.error('Error fetching currency data:', error);
        toast.error('Error fetching currency data');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchCurrencyData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Custom popover for transferFee
  const TransferPopover: React.FC<{ data: any }> = ({ data }) => {
    const [open, setOpen] = useState(false);
    
    return (
      <>
        <button className="popover-btn" onClick={e => { e.stopPropagation(); setOpen(true); }} style={{ cursor: 'pointer', color: '#1976d2', background: 'none', border: 'none', textDecoration: 'underline' }}>
          Transfer
        </button>
        {open && (
          <div className="popover-modal" style={{ position: 'absolute', zIndex: 9999, background: '#fff', color: '#222', border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 220 }}>
            <button style={{ float: 'right', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setOpen(false)}>×</button>
            <Typography variant="h6" mb={1}>Transfer Fee</Typography>
            <Typography>Fee Fixed: {data?.feeFixed}</Typography>
            <Typography>Fee Min: {data?.feeMin ?? '-'}</Typography>
            <Typography>Fee Percent: {data?.feePercent ?? '-'}</Typography>
          </div>
        )}
      </>
    );
  };

  // Custom popover for settings
  const SettingsPopover: React.FC<{ data: any }> = ({ data }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className="popover-btn" onClick={e => { e.stopPropagation(); setOpen(true); }} style={{ cursor: 'pointer', color: '#1976d2', background: 'none', border: 'none', textDecoration: 'underline' }}>
          Settings
        </button>
        {open && (
          <div className="popover-modal" style={{ position: 'absolute', zIndex: 9999, background: '#fff', color: '#222', border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 220 }}>
            <button style={{ float: 'right', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setOpen(false)}>×</button>
            <Typography variant="h6" mb={1}>Settings</Typography>
            <Typography>Currency: {data?.currency ?? '-'}</Typography>
            <Typography>Enabled: {data?.enabled ? 'True' : 'False'}</Typography>
            <Typography>Transfer Enabled: {data?.transferEnabled ? 'True' : 'False'}</Typography>
            <Typography>Wallet Enabled: {data?.walletEnabled ? 'True' : 'False'}</Typography>
            <Typography>Partner: {data?.partner ?? '-'}</Typography>
          </div>
        )}
      </>
    );
  };

    // Custom popover for features
const FeaturePopover: React.FC<{ data: string[] }> = ({ data }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="popover-btn" onClick={e => { e.stopPropagation(); setOpen(true); }} style={{ cursor: 'pointer', color: '#1976d2', background: 'none', border: 'none', textDecoration: 'underline' }}>
        Features
      </button>
      {open && (
        <div className="popover-modal" style={{ position: 'absolute', zIndex: 9999, background: '#fff', color: '#222', border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 220 }}>
          <button style={{ float: 'right', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setOpen(false)}>×</button>
          <Typography variant="h6" mt={2} mb={1}>Features:</Typography>
          <ul>
            {data?.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div> 
      )}
    </>
  );
};



  const columns = [
    { field: 'description', headerName: 'Description' },
    { field: 'id', headerName: 'ID' },
    { field: 'iconUrl', headerName: 'Icon', render: row => <img src={row.iconUrl} alt="icon" style={{ width: 32, height: 32, borderRadius: 6 }} /> },
    { field: 'settings', headerName: 'Settings', render: row => <SettingsPopover data={row.settings} /> },
    { field: 'transferFee', headerName: 'Transfer', render: row => <TransferPopover data={row.settings?.transferFee} /> },
    { field: 'features', headerName: 'Feature', render: row => <FeaturePopover data={row.settings?.features} /> },
    { field: 'shortName', headerName: 'Short Name' },
    { field: 'slug', headerName: 'Slug' },
    { field: 'type', headerName: 'Type' },
    { field: 'totalsPrecision', headerName: 'Total Precision' },
  ];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <GenericTable columns={columns} data={currencyData} />
    </Box>
  );
};

export default CurrencyDataPage;
