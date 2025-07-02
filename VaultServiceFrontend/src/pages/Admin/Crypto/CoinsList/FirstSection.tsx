import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import CustomModal from '@/components/CustomModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FileSpreadsheet, FileText } from 'lucide-react';
import GenericTable from '../../../../components/common/genericTable';
import { Box, Button, Typography, useTheme } from '@mui/material';
import CustomButton from '@/components/CustomButton';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const coinsData = [
    { id: 1, coin: 'BTC', name: 'Bitcoin', coinName: 'BTC', network: 'Bitcoin', default: true, status: true, suspend: false },
    { id: 2, coin: 'ETH', name: 'Ethereum', coinName: 'ETH', network: 'Ethereum', default: false, status: true, suspend: false },
    { id: 3, coin: 'USDT', name: 'Tether', coinName: 'USDT', network: 'Ethereum', default: false, status: false, suspend: true },
    { id: 4 , coin: 'ADA', name: 'Tether', coinName: 'ADA', network: 'Ethereum', default: false, status: false, suspend: true },
    { id: 5, coin: 'SOL', name: 'Tether', coinName: 'SOL', network: 'Ethereum', default: false, status: false, suspend: true },
    { id: 6, coin: 'DOGE', name: 'Tether', coinName: 'DOGE', network: 'Ethereum', default: false, status: false, suspend: true },
  ];

  const [currentData, setCurrentData] = useState(coinsData);

  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleStatusToggle = (row: any) => {
    const updated = currentData.map(item =>
      item.id === row.id ? { ...item, status: !item.status } : item
    );
    setCurrentData(updated);
  };

  const handleSuspendToggle = (row: any) => {
    const updated = currentData.map(item =>
      item.id === row.id ? { ...item, suspend: !item.suspend } : item
    );
    setCurrentData(updated);
  };

  const columns = [
   {
  field: 'coin',
  headerName: 'Coin',
  render: (row: any) => (
    <Box display="flex" alignItems="center" gap={1}>
      <img
        src={`https://assets.coincap.io/assets/icons/${row.coin.toLowerCase()}@2x.png`}
        alt={row.coin}
        width={20}
        height={20}
        style={{ objectFit: 'contain' }}
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
      <span>{row.coin}</span>
    </Box>
  )
},
    { field: 'name', headerName: 'Name' },
    { field: 'coinName', headerName: 'Coin Name' },
    { field: 'network', headerName: 'Network' },
    {
      field: 'default',
      headerName: 'Default',
      render: (row: any) => row.default ? 'Yes' : 'No',
    },
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
      field: 'suspend',
      headerName: 'Suspend',
      render: (row: any) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.suspend}
            onChange={() => handleSuspendToggle(row)}
          />
          <span className="slider"></span>
        </label>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      render: (row: any) => (
        <VisibilityIcon className="action-icon" onClick={() => handleActionClick(row)} />
      )
    }
  ];

  return (
    <Box>

      <GenericTable columns={columns} data={currentData} />

      <CustomModal open={open} onClose={handleClose} title="Coin Details" sx={{ backgroundColor: theme.palette.background.default }}>
        <div className="header-divider" />
        <Box sx={{ mt: 2 }}>
          {selectedRow && (
            <>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography><strong>Coin:</strong></Typography>
                <Typography>{selectedRow.coin}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography><strong>Name:</strong></Typography>
                <Typography>{selectedRow.name}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography><strong>Network:</strong></Typography>
                <Typography>{selectedRow.network}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography><strong>Status:</strong></Typography>
                <Typography>{selectedRow.status ? 'Active' : 'Inactive'}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography><strong>Suspend:</strong></Typography>
                <Typography>{selectedRow.suspend ? 'Yes' : 'No'}</Typography>
              </Box>
            </>
          )}

          <CustomButton onClick={handleClose}>Close</CustomButton>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default FirstSection;
