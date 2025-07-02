import { useState } from 'react';
import autoTable from 'jspdf-autotable';
import CustomModal from '@/components/CustomModal';
import { downloadPDF } from '../../../utils/downloadPDF';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { downloadExcel } from '../../../utils/downloadExcel';
import { Filter, FileSpreadsheet, FileText } from 'lucide-react';
import GenericTable from '../../../components/common/genericTable';
import { Box, Button, Typography, useTheme, TextField } from '@mui/material';
import CommonFilter from '@/components/CustomFilter';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
  };
  const paymentData = [
    {
      invoiceNumber: 'ITIOXX9X9O18958',
      invoiceDate: '02-06-2025',
      invoiceDueDate: '05-10-2024',
      amount: '₹998.00',
      transactions: '₹99',
      paid: '₹27.00',
      status: 'Partial',
    },
    {
      invoiceNumber: 'ITIO91203',
      invoiceDate: '02-06-2025',
      invoiceDueDate: '05-10-2024',
      amount: '₹998.00',
      transactions: '₹99',
      paid: '₹998.00',
      status: 'Paid',
    },
    {
      invoiceNumber: 'ITIONNTNTT53244',
      invoiceDate: '02-06-2025',
      invoiceDueDate: '06-11-2024',
      amount: '₹100.00',
      transactions: '₹99',
      paid: '₹98.00',
      status: 'Partial',
    },
    {
      invoiceNumber: 'XYZQQZQZF35883',
      invoiceDate: '02-06-2025',
      invoiceDueDate: '12-11-2024',
      amount: '$180.00',
      transactions: '₹99',
      paid: '294.00',
      status: 'Unpaid',
    },
    {
      invoiceNumber: 'RGTYTGRFD66E6EO47932',
      invoiceDate: '02-06-2025',
      invoiceDueDate: '19-11-2024',
      amount: '฿66.00',
      transactions: '₹99',
      paid: '฿22800740753258584.00',
      status: 'Unpaid',
    },
  ];

  const handleExcelDownload = () => {
    const formattedData = currentData.map((row) => ({
      InvoiceNumber: row.invoiceNumber,
      InvoiceDate: row.invoiceDate,
      InvoiceDueDate: row.invoiceDueDate,
      Amount: row.amount,
      Transactions: row.transactions,
      Status: row.status,
    }));

    downloadExcel(formattedData, 'TransactionsList.xlsx', 'TransactionsList');
  };

  const handleDownloadPDF = () => {
    const headers = [
      'InvoiceNumber',
      'InvoiceDate',
      'InvoiceDueDate',
      'Amount',
      'Transactions',
      'Status',
    ];

    const formattedData = currentData.map((row) => ({
      InvoiceNumber: row.invoiceNumber,
      InvoiceDate: row.invoiceDate,
      InvoiceDueDate: row.invoiceDueDate,
      Amount: `${Math.abs(Number(row.amount.replace(/[^\d.-]/g, '')))}`,
      Transactions: row.transactions,
      Status: row.status,
    }));

    downloadPDF(formattedData, headers, 'InvoiceList.pdf', 'Invoice List');
  };

  const handleGlobalSearch = (text: string) => {
    setFilterText(text);

    if (text.trim() === '') {
      setCurrentData(paymentData);
      return;
    }

    const lower = text.toLowerCase();

    const filtered = paymentData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );

    setCurrentData(filtered.length ? filtered : []);
    console.log('Filtering by:', text, '→ Found:', filtered.length, 'items');
  };

  const [currentData, setCurrentData] = useState(paymentData);

  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns = [
    { field: 'invoiceNumber', headerName: 'InvoiceNumber' },
    { field: 'invoiceDate', headerName: 'InvoiceDate' },
    { field: 'invoiceDueDate', headerName: 'InvoiceDueDate' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'transactions', headerName: 'Transactions' },
    {
      field: 'status',
      headerName: 'Status',
      render: (row: any) => {
        let chipClass = '';

        switch (row.status.toLowerCase()) {
          case 'paid':
            chipClass = 'success';
            break;
          case 'unpaid':
            chipClass = 'unpaid';
            break;
          case 'partial':
            chipClass = 'pending';
            break;
          default:
            chipClass = ''; // fallback
        }

        return <span className={`status-chip ${chipClass}`}>{row.status}</span>;
      },
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
        <Button
          startIcon={<FileSpreadsheet size={20} />}
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

      {/* Filter Input */}
      {showFilter && (
        <CommonFilter
          label="Search any field"
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
              <strong>InvoiceNumber:</strong>
            </Typography>
            <Typography>{selectedRow?.invoiceNumber}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>invoiceDate:</strong>
            </Typography>
            <Typography>{selectedRow?.invoiceDate}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>InvoiceDueDate:</strong>
            </Typography>
            <Typography>{selectedRow?.invoiceDueDate}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Amount:</strong>
            </Typography>
            <Typography>{selectedRow?.amount}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Transactions:</strong>
            </Typography>
            <Typography>{selectedRow?.transactions}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Status:</strong>
            </Typography>
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
