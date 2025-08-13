import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, CircularProgress, Box, Grid } from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import './Account-card.css';
import { useAppToast } from '@/utils/Toast';

const AllAccounts = () => {
  const toast = useAppToast();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null); // account id
  const [details, setDetails] = useState<{[id: string]: any}>({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
       const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token not found');
        return;
      }
        const res = await axios.get(`${url}/wallet/all-accounts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        setAccounts(res.data?.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

 const handleExpandClick = async (accountId: string) => {
  if (expanded === accountId) {
    setExpanded(null);
    setDetails(null);
    return;
  }

  setExpanded(accountId);
  setDetailsLoading(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token not found');
      return;
    }

    const res = await axios.get(`${url}/wallet/account/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    setDetails(prev => ({
      ...prev,
      [accountId]: res.data.data
    }));

  } catch (err: any) {
    setDetails(null);
    console.error("Failed to fetch account details:", err);
  } finally {
    setDetailsLoading(false);
  }
};

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{p:4}}>{error}</Typography>;

  return (
    <Box mt={4} px={2}>
      {accounts.length === 0 ? (
        <Typography>No accounts found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {accounts.map((acc: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={acc.account}>
              <Box className="account-cards" style={{ position: 'relative' }}>
                <Typography variant="subtitle1">Account ID: {acc.account}</Typography>
                <Typography variant="body2">Status: {acc.status}</Typography>
                <Tooltip title={expanded === acc.account ? 'Hide details' : 'View details'}>
                  <IconButton onClick={() => handleExpandClick(acc.account)} sx={{ position: 'absolute', bottom: 16, right: 16, color: 'white' }}>
                    {expanded === acc.account ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
               {expanded === acc.account && (
                <Box sx={{ mt: 2 }}>
                  {detailsLoading ? (
                    <Box sx={{ textAlign: 'center' }}><CircularProgress size={24} /></Box>
                  ) : details[acc.account] ? (
                    <>
                      <Typography variant="body2">Account Type: {details[acc.account].accountType}</Typography>
                      <Typography variant="body2">Account Short Name: {details[acc.account].shortName || 'N/A'}</Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="error">Failed to load details.</Typography>
                  )}
                </Box>
              )}

              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AllAccounts;
