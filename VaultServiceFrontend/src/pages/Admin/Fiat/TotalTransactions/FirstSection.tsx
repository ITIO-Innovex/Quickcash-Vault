import { useState } from 'react';
import CommonFilter from '@/components/CustomFilter';
import CustomButton from '@/components/CustomButton';
import { downloadPDF } from '../../../../utils/downloadPDF';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomModal from '../../../../components/CustomModal';
import { downloadExcel } from '../../../../utils/downloadExcel';
import { FileSpreadsheet, FileText, Filter } from 'lucide-react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import GenericTable from '../../../../components/common/genericTable';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
  };
  const handleOpen = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const transactionsData = [
    {
      date: '2025-04-15',
      id: '306620906230',
      type: 'Crypto',
      amount: -11,
      details: 'Bank Transfer',
      status: 'Success',
    },
    {
      date: '2025-04-11',
      id: '749333461639',
      type: 'Crypto',
      amount: -11,
      details: 'Stripe',
      status: 'Success',
    },
    {
      date: '2025-04-11',
      id: '619074278315',
      type: 'Crypto',
      amount: -11,
      details: 'Bank Transfer',
      status: 'Success',
    },
    {
      date: '2025-04-08',
      id: '513933449949',
      type: 'Crypto',
      amount: -16,
      details: 'Stripe',
      status: 'Pending',
    },
    {
      date: '2025-04-08',
      id: '581699396447',
      type: 'Crypto',
      amount: -11,
      details: 'Stripe',
      status: 'Success',
    },
    {
      date: '2025-04-08',
      id: '641214588089',
      type: 'Crypto',
      amount: -11,
      details: 'Bank Transfer',
      status: 'Success',
    },
    {
      date: '2025-04-08',
      id: '408277070591',
      type: 'Crypto',
      amount: -16,
      details: 'Stripe',
      status: 'Success',
    },
    {
      date: '2025-04-08',
      id: '902979376168',
      type: 'Crypto',
      amount: -11,
      details: 'Stripe',
      status: 'Success',
    },
    {
      date: '2025-04-08',
      id: '603715238335',
      type: 'Crypto',
      amount: 245.17,
      details: 'Bank Transfer',
      status: 'Failed',
    },
    {
      date: '2025-04-07',
      id: '852361125527',
      type: 'Crypto',
      amount: -31,
      details: 'Bank Transfer',
      status: 'Success',
    },
  ];

  const handleExcelDownload = () => {
    const formattedData = currentData.map((row) => ({
      'Created Date': row.date,
      ID: row.id,
      Type: row.type,
      Amount: `$${Math.abs(row.amount)}`,
      Details: row.details,
      Status: row.status,
    }));

    downloadExcel(formattedData, 'TransactionsList.xlsx', 'TransactionsList');
  };

  const handleDownloadPDF = () => {
    const headers = [
      'Date',
      'Transaction ID',
      'Type',
      'Amount',
      'Details',
      'Status',
    ];
    const formattedData = currentData.map((row) => ({
      'Date': row.date,
      'Transaction ID': row.id,
      Type: row.type,
      Amount: `$${Math.abs(row.amount)}`,
      Details: row.details,
      Status: row.status,
    }));

    downloadPDF(
      formattedData,
      headers,
      'TransactionsList.pdf',
      'Transactions List'
    );
  };

  const handleGlobalSearch = (text: string) => {
  setFilterText(text);

  if (text.trim() === '') {
    setCurrentData(transactionsData);
    return;
  }

  const lower = text.toLowerCase();

  const filtered = transactionsData.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(lower)
    )
  );

  setCurrentData(filtered.length ? filtered : []);
  console.log('Filtering by:', text, '→ Found:', filtered.length, 'items');
};


  const [currentData, setCurrentData] = useState(transactionsData);

  const columns = [
    { field: 'date', headerName: 'Date' },
    { field: 'id', headerName: 'Transaction ID' },
    { field: 'type', headerName: 'Type' },
    {
      field: 'amount',
      headerName: 'Amount',
      render: (row: any) =>
        `${row.amount < 0 ? '-' : '+'}${Math.abs(row.amount)}`,
    },
    {
      field: 'details',
      headerName: 'details',
      render: (row: any) => `${row.details}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (row: any) => (
        <span className={`status-chip ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      render: (row: any) => (
        <VisibilityIcon
          sx={{ cursor: 'pointer' }}
          onClick={() => handleOpen(row)}
        />
      ),
    },
  ];

  return (
    <Box>
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
              <Typography>
                <strong>Date:</strong>
              </Typography>
              <Typography>{selectedRow.date}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>
                <strong>Transaction ID:</strong>
              </Typography>
              <Typography>{selectedRow.id}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>
                <strong>Type:</strong>
              </Typography>
              <Typography>{selectedRow.type}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>
                <strong>Amount:</strong>
              </Typography>
              <Typography>{selectedRow.amount}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>
                <strong>details:</strong>
              </Typography>
              <Typography>{selectedRow.details}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>
                <strong>Status:</strong>
              </Typography>
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
