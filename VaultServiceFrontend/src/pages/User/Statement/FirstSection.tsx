
import { Box, Button, Typography, useTheme, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Filter, FileSpreadsheet, FileText } from 'lucide-react';
import GenericTable from '../../../components/common/genericTable';
import CustomModal from '@/components/CustomModal';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Add type declaration for jsPDF autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const statementData = [
    { date: '2025-04-15', id: '306620906230', type: 'Crypto', amount: -11, balance: 853.16, status: 'Success' },
    { date: '2025-04-11', id: '749333461639', type: 'Crypto', amount: -11, balance: 864.16, status: 'Success' },
    { date: '2025-04-11', id: '619074278315', type: 'Crypto', amount: -11, balance: 875.16, status: 'Success' },
    { date: '2025-04-08', id: '513933449949', type: 'Crypto', amount: -16, balance: 886.16, status: 'Success' },
    { date: '2025-04-08', id: '581699396447', type: 'Crypto', amount: -11, balance: 902.16, status: 'Success' },
  ];

  const [currentData, setCurrentData] = useState(statementData);

  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleFilter = () => {
    setShowFilter(!showFilter);
    if (!showFilter) {
      setFilterDate('');
      setCurrentData(statementData);
    }
  };

  const handleDateFilter = (date: string) => {
    setFilterDate(date);
    if (date) {
      const filtered = statementData.filter(item => item.date === date);
      setCurrentData(filtered);
    } else {
      setCurrentData(statementData);
    }
  };

  const downloadExcel = () => {
    if (currentData.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(currentData.map(row => ({
      'Date': row.date,
      'Transaction ID': row.id,
      'Type': row.type,
      'Amount': `${row.amount < 0 ? '-' : '+'}$${Math.abs(row.amount)}`,
      'Balance': `$${row.balance}`,
      'Status': row.status
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Statements');
    XLSX.writeFile(workbook, 'statements.xlsx');
  };

  const downloadPDF = () => {
    if (currentData.length === 0) return;
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Statements', 14, 22);
    
    const tableData = currentData.map(row => [
      row.date,
      row.id,
      row.type,
      `${row.amount < 0 ? '-' : '+'}$${Math.abs(row.amount)}`,
      `$${row.balance}`,
      row.status
    ]);
    
    (doc as any).autoTable({
      head: [['Date', 'Transaction ID', 'Type', 'Amount', 'Balance', 'Status']],
      body: tableData,
      startY: 30,
    });
    
    doc.save('statements.pdf');
  };

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
      {/* Action Buttons */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Filter size={20} />}
          onClick={handleFilter}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              backgroundColor: theme.palette.primary.light + '10',
            },
          }}
        >
          Filter
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<FileSpreadsheet size={20} />}
          onClick={downloadExcel}
          disabled={currentData.length === 0}
          sx={{
            borderColor: '#10B981',
            color: '#10B981',
            '&:hover': {
              borderColor: '#059669',
              backgroundColor: '#10B981' + '10',
            },
            '&:disabled': {
              borderColor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          Download XLS
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<FileText size={20} />}
          onClick={downloadPDF}
          disabled={currentData.length === 0}
          sx={{
            borderColor: '#EF4444',
            color: '#EF4444',
            '&:hover': {
              borderColor: '#DC2626',
              backgroundColor: '#EF4444' + '10',
            },
            '&:disabled': {
              borderColor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          Download PDF
        </Button>
      </Box>

      {/* Filter Input */}
      {showFilter && (
        <Box sx={{ mb: 3 }}>
          <TextField
            type="date"
            label="Filter by Date"
            value={filterDate}
            onChange={(e) => handleDateFilter(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.dark,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>
      )}

      <GenericTable columns={columns} data={currentData} />

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
