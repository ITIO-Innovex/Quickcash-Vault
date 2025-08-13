import GenericTable from '@/components/common/genericTable';
import { useAppToast } from '@/utils/Toast';
import { Box, Card, CardContent, Typography, Chip, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '@/helpers/apiHelper';     // Yeh import add kar lo
const url = import.meta.env.VITE_NODE_ENV === 'production' ? 'api' : 'api';

const TransactionHistory = () => {
  const theme = useTheme();
  const toast = useAppToast(); 
  const [payinData, setPayinData] = useState([]);

  const columns = [
    { field: 'date', headerName: 'DATE OF TRANSACTION', minWidth: 150 },
    { field: 'trx', headerName: 'TRX', minWidth: 100 },
    { field: 'type', headerName: 'TYPE', minWidth: 200 },
    { field: 'amount', headerName: 'AMOUNT', minWidth: 100 },
    { field: 'balance', headerName: 'BALANCE', minWidth: 100 },
    { field: 'status', headerName: 'STATUS', minWidth: 100 },
  ];

  // On page load, fetch API
  useEffect(() => {
    const fetchPayinData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No token found in localStorage");
          return;
        }

        // API call
        const res = await api.get(`${url}/operation/payin-all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("Payin API response:", res.data);
        setPayinData(res.data || []);

      } catch (err) {
        let errorMsg = "Something went wrong!";
        if (err.response?.data?.errors && err.response.data.errors.length > 0) {
          errorMsg = err.response.data.errors[0].description;
        } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        }
        toast.error(errorMsg);
        console.error("Payin API error:", err);
      }
    };
    fetchPayinData();
  }, [toast]);

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }} style={{backgroundColor:theme.palette.background.default}}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'semibold', color: '#1f2937', mb: 2, px: 3, pt: 2, }}>
            Transaction History
          </Typography>
          <Box sx={{ px: 3, pb: 2 }}>
            <GenericTable
              columns={columns}
              data={payinData}   
              // data={transactionHistory}    // Static 
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionHistory;
