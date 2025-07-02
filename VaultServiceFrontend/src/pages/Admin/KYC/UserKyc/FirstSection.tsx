import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomModal from '../../../../components/CustomModal';
import { Box, Button, Typography, useTheme } from '@mui/material'; 
import GenericTable from '../../../../components/common/genericTable';

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

  const UserKycData = [
  {
    date: '2025-06-02',
    username: 'rodel sayson',
    email: 'rodelsayson25@gmail.com',
    status: 'success',
  },
  {
    date: '2025-06-02',
    username: 'Adeoye aderemi idris',
    email: 'ben283117@gmail.com',
    status:'pending',
  },
  {
    date: '2025-06-02',
    username: 'Cheryl Estor',
    email: 'cherylestor19@gmail.com',
    status: 'failed',
  },
  {
    date: '2025-06-02',
    username: 'chinaza',
    email: 'chinazaamanda36@gmail.com',
    status: 'success',
  },
  {
    date: '2025-06-02',
    username: 'ISOOBA ABUBAKALI',
    email: 'laazpaaz074@gmail.com',
    status: 'pending',
  },
];

 const [currentData, setCurrentData] = useState(UserKycData);

  const columns = [
    { field: 'date', headerName: 'Date' },
    { field: 'username', headerName: 'UserName' },
    { field: 'email', headerName: 'Email' },
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
      <GenericTable columns={columns} data={UserKycData} />
      {/* Modal */}
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Transaction Details"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <div className="header-divider" />
        {selectedRow && (
          <>
            <Box display="flex" justifyContent="space-between" mb={2} mt={4}>
              <Typography><strong>Date:</strong></Typography>
              <Typography>{selectedRow.date}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>userName:</strong></Typography>
              <Typography>{selectedRow.username}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Email:</strong></Typography>
              <Typography>{selectedRow.email}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Status:</strong></Typography>
              <Typography>{selectedRow.status}</Typography>
            </Box>

            <Button
              className="custom-button"
              onClick={handleClose}
              sx={{ mt: 3 }}
            >
              <span className="button-text">Close</span>
            </Button>
          </>
        )}
      </CustomModal>
    </Box>
  );
};

export default FirstSection;
