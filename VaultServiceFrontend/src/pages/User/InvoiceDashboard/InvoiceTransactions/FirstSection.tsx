
import { Box, Button, Typography, useTheme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GenericTable from '../../../../components/common/genericTable';
import CustomModal from '@/components/CustomModal';
import { useState } from 'react';


const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

   const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const TransactionsData = [
  { date: '2025-04-15', id: '306620906230', type: 'Crypto', amount: -11, balance: 853.16, status: 'Success' },
  { date: '2025-04-11', id: '749333461639', type: 'Crypto', amount: -11, balance: 864.16, status: 'Success' },
  { date: '2025-04-11', id: '619074278315', type: 'Crypto', amount: -11, balance: 875.16, status: 'Success' },
  { date: '2025-04-08', id: '513933449949', type: 'Crypto', amount: -16, balance: 886.16, status: 'Success' },
  { date: '2025-04-08', id: '581699396447', type: 'Crypto', amount: -11, balance: 902.16, status: 'Success' },
];


  const columns = [
  { field: 'date', headerName: 'Date' },
  { field: 'id', headerName: 'Transaction ID' },
  { field: 'type', headerName: 'Type' },
  {
    field: 'amount',
    headerName: 'Amount',
    render: (row: any) => `${row.amount < 0 ? '-' : '+'}$${Math.abs(row.amount)}`
  },
  {
    field: 'balance',
    headerName: 'Balance',
    render: (row: any) => `$${row.balance}`
  },
  {
    field: 'status',
    headerName: 'Status',
    render: (row: any) => (
      <span className={`status-chip ${row.status.toLowerCase()}`}>
        {row.status}
      </span>
    )
  },
   {
      field: 'action',
      headerName: 'Action',
      render: (row: any) => (
        <VisibilityIcon style={{ cursor: 'pointer' }} onClick={() => handleActionClick(row)} />
      )
    }
];

  return (
    <Box>
      <GenericTable columns={columns} data={TransactionsData} />

         <CustomModal open={open} onClose={handleClose} title="Statement Details" sx={{backgroundColor: theme.palette.background.default }}>
              <div className="header-divider" />
              
              <Box sx={{ mt: 2 }}>
                 <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Date:</strong></Typography>
                      <Typography>{selectedRow?.date}</Typography>
                      </Box>
      
                      <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Transaction ID:</strong></Typography>
                      <Typography>{selectedRow?.id}</Typography>
                      </Box>
      
                      <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Type:</strong></Typography>
                      <Typography>{selectedRow?.type}</Typography>
                      </Box>
      
                      <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Amount:</strong></Typography>
                      <Typography>${selectedRow?.amount}</Typography>
                      </Box>
      
                      <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Balance:</strong></Typography>
                      <Typography>${selectedRow?.balance}</Typography>
                      </Box>
      
                      <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Status:</strong></Typography>
                      <Typography>{selectedRow?.status}</Typography>
                      </Box>
      
                      <Button
                      className="custom-button"
                      onClick={handleClose}
                      sx={{ mt: 3 }}
                      >
                      <span className="button-text">Close</span>
                      </Button>
              </Box>
              </CustomModal>
    </Box>
  );
};

export default FirstSection;
