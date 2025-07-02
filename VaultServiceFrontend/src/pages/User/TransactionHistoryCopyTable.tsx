import { useState } from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import CustomTable from '@/components/CustomTable';
import GenericTable from '@/components/common/genericTable';

const TransactionHistory = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { field: 'date', headerName: 'DATE OF TRANSACTION', minWidth: 150 },
    { field: 'trx', headerName: 'TRX', minWidth: 100 },
    { field: 'type', headerName: 'TYPE', minWidth: 200 },
    { field: 'amount', headerName: 'AMOUNT', minWidth: 100 },
    { field: 'balance', headerName: 'BALANCE', minWidth: 100 },
    { field: 'status', headerName: 'STATUS', minWidth: 100 },
  ];

  const transactionHistory = [
    {
      date: '2025-01-30',
      trx: 'TRX12345678',
      type: 'Beneficiary Transfer Money',
      amount: '$ 10600',
      balance: '$ 10145.83',
      status: (
        <Chip
          label="PENDING"
          sx={{
            backgroundColor: '#fffbe0',
            color: '#b45309',
            fontWeight: 'semibold',
            borderRadius: '9999px',
            fontSize: '0.75rem',
          }}
        />
      ),
    },
    // Add more rows if needed
  ];

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'semibold',
              color: '#1f2937',
              mb: 2,
              px: 3,
              pt: 2,
            }}
          >
            Transaction History
          </Typography>
          <Box sx={{ px: 3, pb: 2 }}>
            <GenericTable
              columns={columns}
              data={transactionHistory}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionHistory;
