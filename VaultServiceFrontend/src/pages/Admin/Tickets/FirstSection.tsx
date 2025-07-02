import { useState } from 'react';
import { Filter } from 'lucide-react';
import CustomModal from '@/components/CustomModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GenericTable from '../../../components/common/genericTable';
import { Box, Button, Typography, useTheme } from '@mui/material';
import CommonFilter from '@/components/CustomFilter';
import CustomButton from '@/components/CustomButton';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
  };
  const ticketData = [
    {
      ticketId: '174824079065597980',
      date: '2025-05-26',
      username: 'Prashant Bhatnager',
      subject: 'KYC APPROVAL',
      message:
        'I have submitted my documents. kindly approve my kyc so that I could borrow money',
      status: 'Open',
    },
    {
      ticketId: '174762975561695000',
      date: '2025-05-19',
      username: 'Jennilyn Geraldo',
      subject: 'loan application',
      message: 'update',
      status: 'Open',
    },
    {
      ticketId: '174746936016954880',
      date: '2025-05-17',
      username: 'Vishal masih',
      subject: 'from yesterday my amount not yet been credited',
      message: 'kindly to the needful',
      status: 'Open',
    },
    {
      ticketId: '174623379376772000',
      date: '2025-05-03',
      username: 'BrticoLibert',
      subject: 'pueden',
      message: 'verificar mi kyc',
      status: 'Close',
    },
    {
      ticketId: '174542495913819780',
      date: '2025-04-23',
      username: 'Ganesh',
      subject: 'demo',
      message: 'klkokedsjfklvcm,',
      status: 'Close',
    },
  ];

  const [currentData, setCurrentData] = useState(ticketData);

  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleGlobalSearch = (text: string) => {
    setFilterText(text);
    if (text.trim() === '') {
      setCurrentData(ticketData);
      return;
    }

    const lower = text.toLowerCase();

    const filtered = ticketData.filter((row) =>
      Object.values(row).some(
        (val) => typeof val === 'string' && val.toLowerCase().includes(lower)
      )
    );

    setCurrentData(filtered.length ? filtered : []);
  };

  const columns = [
    { field: 'ticketId', headerName: 'TicketId' },
    { field: 'date', headerName: 'Date' },
    { field: 'username', headerName: 'UserName' },
    { field: 'subject', headerName: 'Subject' },
    { field: 'message', headerName: 'Message' },
    {
      field: 'status',
      headerName: 'Status',
      render: (row: any) => (
        <span
          className={`status-chip ${row.status === 'Open' ? 'success' : 'pending'}`}
        >
          {row.status}
        </span>
      ),
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
        sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center', }}>
        <Button startIcon={<Filter size={20} />} onClick={handleFilter} sx={{color:theme.palette.navbar.text}} > Filter </Button>
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
              <strong>Ticket ID:</strong>
            </Typography>
            <Typography>{selectedRow?.ticketId}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Date:</strong>
            </Typography>
            <Typography>{selectedRow?.date}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>UserName:</strong>
            </Typography>
            <Typography>{selectedRow?.userName}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Subject:</strong>
            </Typography>
            <Typography>{selectedRow?.subject}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Message:</strong>
            </Typography>
            <Typography>{selectedRow?.message}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>
              <strong>Status:</strong>
            </Typography>
            <Typography>{selectedRow?.status}</Typography>
          </Box>

         <CustomButton onClick={handleClose}>Close</CustomButton>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default FirstSection;
