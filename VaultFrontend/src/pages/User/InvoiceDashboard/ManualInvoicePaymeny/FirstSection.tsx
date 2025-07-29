import { useState } from 'react';
import CustomModal from '@/components/CustomModal';
import CommonFilter from '@/components/CustomFilter';
import { downloadPDF } from '../../../../utils/downloadPDF';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { downloadExcel } from '../../../../utils/downloadExcel';
import { Filter, FileSpreadsheet, FileText } from 'lucide-react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import GenericTable from '../../../../components/common/genericTable';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const manualPayementData = [
    { date: '2025-04-15', id: '306620906230', type: 'Crypto', status: 'Success' },
    { date: '2025-04-11', id: '749333461639', type: 'Crypto', status: 'Failed' },
  ];

    const handleExcelDownload = () => {
      const formattedData = currentData.map((row) => ({
        'Created Date': row.date,
        ID: row.id,
        Type:row.type,
        // Amount: `$${Math.abs(row.amount)}`,
        Status: row.status,
      }));
  
      downloadExcel(formattedData, 'ManualInvoicePaymentList.xlsx', 'ManualInvoicePaymentList');
    };
  
    const handleDownloadPDF = () => {
      const headers = [
        'Date',
        'ID',
        'Type',
        'Status',
      ];
      const formattedData = currentData.map((row) => ({
        'Date': row.date,
        'ID': row.id,
        // Amount: `$${Math.abs(row.amount)}`,
        'Type':row.type,
        Status: row.status,
      }));
  
      downloadPDF(
        formattedData,
        headers,
        'ManualPayementList.pdf',
        'ManualPayementList'
      );
    };
  
    const handleGlobalSearch = (text: string) => {
    setFilterText(text);
  
    if (text.trim() === '') {
      setCurrentData(manualPayementData);
      return;
    }
  
    const lower = text.toLowerCase();
  
    const filtered = manualPayementData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
  
    setCurrentData(filtered.length ? filtered : []);
    console.log('Filtering by:', text, '→ Found:', filtered.length, 'items');
  };
  
  const [currentData, setCurrentData] = useState(manualPayementData);

  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };


  const columns = [
    { field: 'date', headerName: 'Created Date' },
    { field: 'id', headerName: 'Product Name' },
    { field: 'id', headerName: 'Category' },
    { field: 'type', headerName: 'Product' },
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
          alignItems: 'center',
        }}
      >
        <Button startIcon={<FileSpreadsheet size={20} />}
          sx={{ color: theme.palette.navbar.text }}
          onClick={handleExcelDownload}
          disabled={currentData.length === 0}
        >
          Download Excel
        </Button>

        <Button
          startIcon={<FileText size={20} />}
          sx={{ color: theme.palette.navbar.text }}
          onClick={handleDownloadPDF}
          disabled={currentData.length === 0}
        >
          {' '}
          Download PDF
        </Button>

        <Button
          startIcon={<Filter size={20} />}
          onClick={handleFilter}
          sx={{ color: theme.palette.navbar.text }}
        >
          {' '}
          Filter{' '}
        </Button>
      </Box>

        {showFilter && (
        <CommonFilter          label="Search any field"
          value={filterText}
          onChange={handleGlobalSearch}
          width="200px"
        />
      )}
      {currentData.length ? (
        <GenericTable columns={columns} data={currentData} />
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No data found.
        </Typography>
      )}


      <CustomModal open={open} onClose={handleClose} title="Invoice Payment Details" sx={{backgroundColor: theme.palette.background.default }}>
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
