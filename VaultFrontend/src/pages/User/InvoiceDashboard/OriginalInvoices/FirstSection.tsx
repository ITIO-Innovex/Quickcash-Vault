import { useEffect, useState } from 'react';
import CustomModal from '@/components/CustomModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { downloadPDF } from '../../../../utils/downloadPDF';
import { downloadExcel } from '../../../../utils/downloadExcel';
import { Filter, FileSpreadsheet, FileText } from 'lucide-react';
import GenericTable from '../../../../components/common/genericTable';
import { Box, Button, Typography, useTheme } from '@mui/material';
import CommonFilter from '@/components/CustomFilter';
import CommonTooltip from '@/components/common/toolTip';

const FirstSection = ({ originalData = [], recurrentData = [], loading = false }: any) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [currentData, setCurrentData] = useState<any[]>(originalData);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  useEffect(() => {
    setCurrentData(originalData);
  }, [originalData]);

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleExcelDownload = () => {
    const formattedData = currentData.map((row) => ({
      'Invoice Number': row.id,
      'Created Date': row.lastModifiedDate ? new Date(row.lastModifiedDate).toLocaleDateString() : '-',
      Amount: `$${Math.abs(row.amount)}`,
      Status: row.status,
    }));
    downloadExcel(formattedData, 'InvoiceList.xlsx', 'InvoiceList');
  };

  const handleDownloadPDF = () => {
    const headers = [
      'Invoice Number',
      'Date',
      'Amount',
      'Status',
    ];
    const formattedData = currentData.map((row) => ({
      'Invoice Number': row.id,
      'Date': row.lastModifiedDate ? new Date(row.lastModifiedDate).toLocaleDateString() : '-',
      Amount: `$${Math.abs(row.amount)}`,
      Status: row.status,
    }));
    downloadPDF(
      formattedData,
      headers,
      'InvoiceList.pdf',
      'Invoice List'
    );
  };

  const handleGlobalSearch = (text: string) => {
    setFilterText(text);
    if (text.trim() === '') {
      setCurrentData(originalData);
      return;
    }
    const lower = text.toLowerCase();
    const filtered = originalData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
    setCurrentData(filtered.length ? filtered : []);
  };

  const originalColumns = [
    { field: 'id', headerName: 'Invoice Id' },
    {
      field: 'lastModifiedDate',
      headerName: 'Last Modified Date',
      render: (row: any) =>
        row.lastModifiedDate
          ? new Date(row.lastModifiedDate).toLocaleDateString()
          : '-',
    },
    { field: 'type', headerName: 'Type' },
    { field: 'currency', headerName: 'Currency' },
    {
      field: 'amount',
      headerName: 'Amount',
      render: (row) => `$${row.amount}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (row) => (
        <span className={`status-chip ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      render: (row: any) => (
        <CommonTooltip title="More Details">
          <VisibilityIcon style={{ cursor: 'pointer' }} onClick={() => handleActionClick(row)} />
        </CommonTooltip>
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
          disabled={currentData.length === 0 || loading}
        >
          Download Excel
        </Button>
        <Button
          startIcon={<FileText size={20} />}
          sx={{ color: theme.palette.navbar.text }}
          onClick={handleDownloadPDF}
          disabled={currentData.length === 0 || loading}
        >
          Download PDF
        </Button>
        <Button
          startIcon={<Filter size={20} />}
          onClick={handleFilter}
          sx={{ color: theme.palette.navbar.text }}
        >
          Filter
        </Button>
      </Box>
      {showFilter && (
        <CommonFilter label="Search any field"
          value={filterText}
          onChange={handleGlobalSearch}
          width="200px"
        />
      )}      {currentData.length > 0 ? (
        <GenericTable columns={originalColumns} data={currentData} />
      ) : (
        <Typography>No original invoices found.</Typography>
      )}
      <CustomModal open={open} onClose={handleClose} title="Invoice-Section Details" sx={{ backgroundColor: theme.palette.background.default }}>
        <div className="header-divider" />
        <Box sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>Date:</strong></Typography>
            <Typography>{selectedRow?.lastModifiedDate ? new Date(selectedRow.lastModifiedDate).toLocaleDateString() : '-'}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>Invoice ID:</strong></Typography>
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
