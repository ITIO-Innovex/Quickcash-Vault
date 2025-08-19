import { useEffect, useState } from 'react';
import CustomModal from '@/components/CustomModal';
import CommonFilter from '@/components/CustomFilter';
import CommonTooltip from '@/components/common/toolTip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { downloadPDF } from '../../../../utils/downloadPDF';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { downloadExcel } from '../../../../utils/downloadExcel';
import { Filter, FileSpreadsheet, FileText } from 'lucide-react';
import GenericTable from '../../../../components/common/genericTable';
import { Box, Button, CircularProgress, IconButton, Typography, useTheme } from '@mui/material';
import InvoicePayment from '@/modal/invoiceModal';

const FirstSection = ({ originalData = [], recurrentData = [], loading = false }: any) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [invoice, setInvoice] = useState<any>(null);
  const [payLoading, setPayLoading] = useState(null);
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
    const headers = [ 'Invoice Number','Date','Amount','Status', ];

    const formattedData = currentData.map((row) => ({
      'Invoice Number': row.id,
      'Date': row.lastModifiedDate ? new Date(row.lastModifiedDate).toLocaleDateString() : '-',
      Amount: `$${Math.abs(row.amount)}`,
      Status: row.status,
    }));
    downloadPDF( formattedData, headers, 'InvoiceList.pdf', 'Invoice List' );
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

     const handlePayInvoice = async (row) => {
      setIsLoading(true);
      const invoiceId = row.id
      console.log("Invoice Id passed",invoiceId);
      setInvoice(invoiceId);
      setOpen(true);
      setIsLoading(false);
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
         <Box display="flex" alignItems="center" gap={1}>
        <CommonTooltip title="More Details">
          <VisibilityIcon style={{ cursor: 'pointer' }} onClick={() => handleActionClick(row)} />
        </CommonTooltip>
        {/* 2. Pay Invoice Icon */}
      <CommonTooltip title="Pay Invoice">
        <span>
          <IconButton
            color="success"
            onClick={() => handlePayInvoice(row)}
            disabled={payLoading === row.id}
            size="small"
          >
            {payLoading === row.id
              ? <CircularProgress size={20} />
              : <AttachMoneyIcon />}
          </IconButton>
        </span>
      </CommonTooltip>
        </Box>
      )
    },
  ];

  return (
    <Box>
      {/* Action Buttons */}
      <Box
        sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center',}}>
        <Button startIcon={<FileSpreadsheet size={20} />}
          sx={{ color: theme.palette.navbar.text }} onClick={handleExcelDownload} disabled={currentData.length === 0 || loading}>
          Download Excel
        </Button>
        <Button startIcon={<FileText size={20} />} sx={{ color: theme.palette.navbar.text }} onClick={handleDownloadPDF} disabled={currentData.length === 0 || loading}>
          Download PDF
        </Button>
        <Button startIcon={<Filter size={20} />} onClick={handleFilter} sx={{ color: theme.palette.navbar.text }}>
          Filter
        </Button>
      </Box>
      {showFilter && (
        <CommonFilter label="Search any field" value={filterText} onChange={handleGlobalSearch} width="200px"/>
      )}  {currentData.length > 0 ? (
        <GenericTable columns={originalColumns} data={currentData} />
      ) : (
        <Typography>No original invoices found.</Typography>
      )}

       {/* Modal for Invoice Payment */}
        <InvoicePayment open={open} invoice={invoice} handleClose={handleClose} />
    </Box>
  );
};

export default FirstSection;
