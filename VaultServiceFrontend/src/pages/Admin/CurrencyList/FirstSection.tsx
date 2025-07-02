import { useState } from 'react';
import CustomModal from '@/components/CustomModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GenericTable from '../../../components/common/genericTable';
import { Box, Button, Typography, useTheme,Tooltip } from '@mui/material';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const currencyData = [
    {
      date: '2025-05-02',
      currency: 'INR',
      status: false,
    },
    {
      date: '2025-05-21',
      currency: 'USD',
      status: false,
    },
    {
      date: '2025-05-03',
      currency: 'GBP',
      status: false,
    },
  ];

  const [currentData, setCurrentData] = useState(currencyData);

  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleStatusToggle = (row: any) => {
    const confirmToggle = window.confirm("Are you sure you want to change the status?");
    if (!confirmToggle) return;

    const updatedData = currentData.map(item =>
      item.date === row.date ? { ...item, status: !item.status } : item
    );

    setCurrentData(updatedData);
  };

  const columns = [
    { field: 'date', headerName: 'Date' },
    { field: 'currency', headerName: 'Currency' },
    { field: 'date', headerName: 'date' },
    {
      field: 'status',
      headerName: 'Status',
      render: (row: any) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.status}
            onChange={() => handleStatusToggle(row)}
          />
          <span className="slider"></span>
        </label>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      render: (row: any) => (
        <Tooltip title="View Details">
          <VisibilityIcon className="action-icon" onClick={() => handleActionClick(row)} />
        </Tooltip>
      )
    }
  ];

  return (
    <Box>

      <GenericTable columns={columns} data={currentData} />

      <CustomModal
        open={open}
        onClose={handleClose}
        title="Statement Details"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <div className="header-divider" />

        <Box sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>Date:</strong></Typography>
            <Typography>{selectedRow?.date}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>Currency:</strong></Typography>
            <Typography>{selectedRow?.currency}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>date:</strong></Typography>
            <Typography>{selectedRow?.date}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>Status:</strong></Typography>
            <Typography>
              {selectedRow?.status ? '✅ Active' : '❌ Inactive'}
            </Typography>
          </Box>

          <Button className="custom-button" onClick={handleClose} sx={{ mt: 3 }}>
            <span className="button-text">Close</span>
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default FirstSection;
