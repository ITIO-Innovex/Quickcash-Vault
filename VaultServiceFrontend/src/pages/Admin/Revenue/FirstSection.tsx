import { useState } from 'react';
import CustomModal from '@/components/CustomModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GenericTable from '../../../components/common/genericTable';
import { Box, Button, Typography, useTheme, TextField } from '@mui/material';
import CustomButton from '@/components/CustomButton';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const RevenueData = [
    {
      date: '2025-05-31',
      username: 'karan aujla',
      email: 'wavy@gmail.com',
      amount: '$270.00',
      method: 'Bank Transfer',
      type: 'External Transfer',
      status: 'Success',
    },
    {
      date: '2025-05-31',
      username: 'karan aujla',
      email: 'wavy@gmail.com',
      amount: '$3386.04',
      method: 'Add Money Through Stripe',
      type: 'Add Money',
      status: 'Success',
    },
    {
      date: '2025-05-31',
      username: 'karan aujla',
      email: 'wavy@gmail.com',
      amount: '₹23.00',
      method: 'Bank Transfer',
      type: 'External Transfer',
      status: 'Pending',
    },
    {
      date: '2025-05-31',
      username: 'karan aujla',
      email: 'wavy@gmail.com',
      amount: '$5925.12',
      method: 'Add Money Through Stripe',
      type: 'Add Money',
      status: 'Success',
    },
    {
      date: '2025-05-31',
      username: 'karan aujla',
      email: 'wavy@gmail.com',
      amount: '€210.00',
      method: 'Add Money Through Stripe',
      type: 'Add Money',
      status: 'Failed',
    },
  ];


  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns = [
    { field: 'date', headerName: 'Date' },
    { field: 'username', headerName: 'UserName' },
    { field: 'email', headerName: 'Email' },
    { field: 'method', headerName: 'Method' },
    { field: 'type', headerName: 'Type' },
    {
      field: 'amount',
      headerName: 'Amount',
      render: (row: any) => {
        const numeric = parseFloat(row.amount.replace(/[^0-9.-]+/g, ''));
        const symbol = row.amount.trim().charAt(0); // $, ₹, €
        return `${numeric < 0 ? '-' : '+'}${symbol}${Math.abs(numeric).toFixed(2)}`;
      },
    },

    {
      field: 'status',
      headerName: 'Status',
      render: (row: any) => (
        <span className={`status-chip ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      render: (row: any) => (
        <VisibilityIcon
          style={{ cursor: 'pointer' }}
          onClick={() => handleActionClick(row)}
        />
      ),
    },
  ];

  return (
    <Box>

      <GenericTable columns={columns} data={RevenueData} />

      <CustomModal
        open={open}
        onClose={handleClose}
        title="Statement Details"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <div className="header-divider" />

        <Box sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Date:</strong>
            </Typography>
            <Typography>{selectedRow?.date}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>UserName:</strong>
            </Typography>
            <Typography>{selectedRow?.username}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Email:</strong>
            </Typography>
            <Typography>{selectedRow?.email}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Method:</strong>
            </Typography>
            <Typography>${selectedRow?.method}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Type:</strong>
            </Typography>
            <Typography>${selectedRow?.type}</Typography>
          </Box>

           <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Amount:</strong>
            </Typography>
            <Typography>${selectedRow?.amount}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Status:</strong>
            </Typography>
            <Typography>{selectedRow?.status}</Typography>
          </Box>

          <CustomButton onClick={handleClose}>Close</CustomButton>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default FirstSection;
