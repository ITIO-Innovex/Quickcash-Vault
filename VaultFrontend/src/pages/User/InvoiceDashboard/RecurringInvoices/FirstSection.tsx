import { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { FileSpreadsheet, FileText, Filter } from 'lucide-react';
import GenericTable from '../../../../components/common/genericTable';
import CommonFilter from '@/components/CustomFilter';
import CommonTooltip from '@/components/common/toolTip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomModal from '@/components/CustomModal';
import { downloadPDF } from '../../../../utils/downloadPDF';
import { downloadExcel } from '../../../../utils/downloadExcel';

const FirstSection = ({ recurrentData = [], loading = false }: any) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [currentData, setCurrentData] = useState<any[]>(recurrentData);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  useEffect(() => {
    setCurrentData(recurrentData);
  }, [recurrentData]);

  const handleFilter = () => setShowFilter((prev) => !prev);

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
      'Recurrent ID': row.id,
      Currency: row.currency,
      lastModifiedDate: row.linkedInvoices?.[0]?.lastModifiedDate
        ? new Date(row.linkedInvoices[0].lastModifiedDate).toLocaleDateString()
        : '-',
      'Next Payment Date': row.nextPaymentDate
        ? new Date(row.nextPaymentDate).toLocaleDateString()
        : '-',
      'Initial Payment Amount': row.initialPaymentAmount,
      Interval: row.recurrentInvoiceInterval,
      Amount: `$${row.amount}`,
      Status: row.status,
    }));
    downloadExcel(
      formattedData,
      'RecurrentInvoiceList.xlsx',
      'RecurrentInvoiceList'
    );
  };

  const handleDownloadPDF = () => {
    const headers = [
      'Recurrent ID',
      'Currency',
      'Last Modified Date',
      'Next Payment Date',
      'Initial Payment Amount',
      'Interval',
      'Amount',
      'Status',
    ];
    const formattedData = currentData.map((row) => ({
      'Recurrent ID': row.id,
      Currency: row.currency,
      lastModifiedDate: row.linkedInvoices?.[0]?.lastModifiedDate
        ? new Date(row.linkedInvoices[0].lastModifiedDate).toLocaleDateString()
        : '-',
      'Next Payment Date': row.nextPaymentDate
        ? new Date(row.nextPaymentDate).toLocaleDateString()
        : '-',
      'Initial Payment Amount': row.initialPaymentAmount,
      Interval: row.recurrentInvoiceInterval,
      Amount: `$${row.amount}`,
      Status: row.status,
    }));
    downloadPDF(
      formattedData,
      headers,
      'RecurrentInvoiceList.pdf',
      'Recurrent Invoice List'
    );
  };

  const handleGlobalSearch = (text: string) => {
    setFilterText(text);
    if (text.trim() === '') {
      setCurrentData(recurrentData);
      return;
    }
    const lower = text.toLowerCase();
    const filtered = recurrentData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
    setCurrentData(filtered.length ? filtered : []);
  };

  const recurrentColumns = [
    { field: 'id', headerName: 'Recurrent ID' },
    { field: 'currency', headerName: 'Currency' },
   {
  field: 'lastModifiedDate',
  headerName: 'Last Modified Date',
  render: (row: any) =>
    row.lastModifiedDate
      ? new Date(row.lastModifiedDate).toLocaleDateString()
      : '-',
},
    {
      field: 'nextPaymentDate',
      headerName: 'Next Payment Date',
      render: (row: any) =>
        row.nextPaymentDate
          ? new Date(row.nextPaymentDate).toLocaleDateString()
          : '-',
    },
    {
      field: 'initialPaymentAmount',
      headerName: 'Initial Payment Amount',
      render: (row) => `$${row.initialPaymentAmount ?? '-'}`,
    },
    { field: 'recurrentInvoiceInterval', headerName: 'Interval' },
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
          <VisibilityIcon
            style={{ cursor: 'pointer' }}
            onClick={() => handleActionClick(row)}
          />
        </CommonTooltip>
      ),
    },
  ];

  return (
    <Box mt={5}>
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
        <CommonFilter
          label="Search any field"
          value={filterText}
          onChange={handleGlobalSearch}
          width="200px"
        />
      )}
      <Typography variant="h6" gutterBottom>
        Recurrent Invoices
      </Typography>
      {currentData.length > 0 ? (
        <GenericTable columns={recurrentColumns} data={currentData} />
      ) : (
        <Typography>No recurrent invoices found.</Typography>
      )}
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Recurrent Invoice Details"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <div className="header-divider" />
        <Box sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Recurrent ID:</strong>
            </Typography>
            <Typography>{selectedRow?.id}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Next Payment Date:</strong>
            </Typography>
            <Typography>
              {selectedRow?.nextPaymentDate
                ? new Date(selectedRow.nextPaymentDate).toLocaleDateString()
                : '-'}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Amount:</strong>
            </Typography>
            <Typography>${selectedRow?.amount}</Typography>
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
