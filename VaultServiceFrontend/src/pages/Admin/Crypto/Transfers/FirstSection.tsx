import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import autoTable from 'jspdf-autotable';
import { FileSpreadsheet, FileText } from 'lucide-react';
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

  const TransactionsData = [
    { date: '2025-04-15', username: 'Shristy', email: 'A@example.com', type:'Buy', coin:'BTC',  amount:'00',  status: 'Success' },
    { date: '2025-04-11', username: 'Shristy', email: 'A@example.com', type:'Buy', coin:'USDT', amount:'00',  status: 'Success' },
    { date: '2025-04-11', username: 'Shristy', email: 'A@example.com', type:'Sell', coin:'BTC', amount:'00',  status: 'Success' },
    { date: '2025-04-08', username: 'Shristy', email: 'A@example.com', type:'Buy', coin:'SOL',  amount:'00',  status: 'Pending' },
    { date: '2025-04-08', username: 'Shristy', email: 'A@example.com', type:'Sell', coin:'SHIB',amount:'00',  status: 'Success' },
    { date: '2025-04-08', username: 'Shristy', email: 'A@example.com', type:'Buy', coin:'ADA',  amount:'00',  status: 'Success' },
  ];

  const columns = [
    { field: 'date', headerName: 'Date' },
    { field: 'username', headerName: 'Username' },
    { field: 'email', headerName: 'Email' },
    { field: 'type', headerName: 'Type' },
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
    { field: 'amount', headerName: 'Amount' },
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
    
      <GenericTable columns={columns} data={TransactionsData} />

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
              <Typography><strong>Username:</strong></Typography>
              <Typography>{selectedRow.username}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>email:</strong></Typography>
              <Typography>{selectedRow.email}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Type:</strong></Typography>
              <Typography>{selectedRow.type}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Coin:</strong></Typography>
              <Typography>{selectedRow.coin}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography><strong>Amount:</strong></Typography>
              <Typography>{selectedRow.amount}</Typography>
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
