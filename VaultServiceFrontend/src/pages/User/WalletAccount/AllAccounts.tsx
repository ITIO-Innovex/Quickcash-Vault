import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, CircularProgress, Box, Grid } from '@mui/material';
import AccountCard from './AccountCard'; 

const AllAccounts = () => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(`${API_URL}/wallet/all-accounts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });

        console.log('✅ API Response:', res.data);
        // ⚠️ Check the actual structure — adjust accordingly
       setAccounts(res.data?.data || []);
      } catch (err: any) {
        console.error('❌ Error fetching accounts:', err?.response?.data || err.message);
        setError(err?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{p:4}}>{error}</Typography>;

  return (
    <Box mt={4} px={2}>
      <Typography variant="h5" gutterBottom>
        My Wallet Accounts
      </Typography>

      {accounts.length === 0 ? (
        <Typography>No accounts found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {accounts.map((acc: any) => (
            
            <Grid item xs={12} sm={6} md={4} lg={3} key={acc.account}>
              <AccountCard
                account={acc.account}
                accountType={acc.accountType}
                shortName={acc.shortName}
                status={acc.status}
                onClick={() => console.log('Account clicked:', acc.account)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AllAccounts;
