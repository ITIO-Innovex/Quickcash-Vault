import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomModal from '../../../../components/CustomModal';
import { Box, Button, Typography, useTheme } from '@mui/material'; 
import GenericTable from '../../../../components/common/genericTable';
import CustomButton from '@/components/CustomButton';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const handleOpen = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const pendingTransactionsData = [
    { date: '2025-04-15', username: 'Shristy', email: 'A@example.com', amount: 898989, mobile: '1234', status: 'Success' },
    { date: '2025-04-11', username: 'Shristy', email: 'A@example.com', amount: 898989,  mobile: '1234', status: 'Success' },
    { date: '2025-04-11', username: 'Shristy', email: 'A@example.com', amount: 898989,  mobile: '1234', status: 'Success' },
    { date: '2025-04-08', username: 'Shristy', email: 'A@example.com', amount: 898989,  mobile: '1234', status: 'Pending' },
    { date: '2025-04-08', username: 'Shristy', email: 'A@example.com', amount: 898989,  mobile: '1234', status: 'Success' },
    { date: '2025-04-08', username: 'Shristy', email: 'A@example.com', amount: 898989,  mobile: '1234', status: 'Success' },
  ];


  const columns = [
    { field: 'date', headerName: 'Date' },
    { field: 'username', headerName: 'Username' },
    { field: 'email', headerName: 'email' },
    {
      field: 'amount',
      headerName: 'Amount',
      render: (row: any) => `${row.amount < 0 ? '-' : '+'}$${Math.abs(row.amount)}`
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      render: (row: any) => `$${row.mobile}`
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
        <VisibilityIcon
          sx={{ cursor: 'pointer' }} 
          onClick={() => handleOpen(row)}
        />
      )
    }
  ];

  return (
    <Box>

      <GenericTable columns={columns} data={pendingTransactionsData} />

      {/* Modal */}
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Transaction Details"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <div className="header-divusernameer" />
        {selectedRow && (
          <>
            <Box display="flex" justifyContent="space-between" mb={2} mt={4}>
              <Typography><strong>Date:</strong></Typography>
              <Typography>{selectedRow.date}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Transaction username:</strong></Typography>
              <Typography>{selectedRow.username}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>email:</strong></Typography>
              <Typography>{selectedRow.email}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Amount:</strong></Typography>
              <Typography>{selectedRow.amount}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Mobile:</strong></Typography>
              <Typography>{selectedRow.mobile}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Status:</strong></Typography>
              <Typography>{selectedRow.status}</Typography>
            </Box>

          <CustomButton onClick={handleClose}>Close</CustomButton>
          </>
        )}
      </CustomModal>
    </Box>
  );
};

export default FirstSection;
