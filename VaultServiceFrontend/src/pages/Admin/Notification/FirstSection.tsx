import { useState } from 'react';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import { Box, Typography, useTheme} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GenericTable from '../../../components/common/genericTable';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const NotificationsData = [
  {
    date: '2024-09-16',
    message: 'Wallet Address request status has been updated by the Admin for coin DOGE_TEST',
    type: 'User Wise',
  },
  {
    date: '2024-09-23',
    message: 'Wallet Address request status has been updated by the Admin for coin BTC_TEST',
    type: 'User Wise',
  },
  {
    date: '2024-10-01',
    message: 'Test',
    type: 'User Wise',
  },
  {
    date: '2024-10-09',
    message: 'Wallet Address request status has been updated by the Admin for coin DOGE_TEST',
    type: 'User Wise',
  },
  {
    date: '2024-10-09',
    message: 'Wallet Address request status has been updated by the Admin for coin DOGE_TEST',
    type: 'User Wise',
  },
  {
    date: '2024-10-09',
    message: 'Crypto status has been updated by the admin',
    type: 'User Wise',
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
    { field: 'message', headerName: 'Message' },
  {
  field: 'type',
  headerName: 'Type',
  render: (row: any) => (
    <span className="type-chip">
      {row.type}
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

      <GenericTable columns={columns} data={NotificationsData} />

      <CustomModal
        open={open}
        onClose={handleClose}
        title="Fee Details"
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
              <strong>Message:</strong>
            </Typography>
            <Typography>{selectedRow?.message}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Type:</strong>
            </Typography>
            <Typography>{selectedRow?.type}</Typography>
          </Box>

          <CustomButton onClick={handleClose}>Close</CustomButton>

        </Box>
      </CustomModal>
    </Box>
  );
};

export default FirstSection;
