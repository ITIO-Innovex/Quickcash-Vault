
import { useState } from 'react';
import CustomModal from '@/components/CustomModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Filter, FileSpreadsheet, FileText } from 'lucide-react';
import GenericTable from '../../../components/common/genericTable';
import { Box, Button, Typography, useTheme, TextField } from '@mui/material';
import CustomButton from '@/components/CustomButton';

const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const feeData = [
  { name: '306620906230', type: 'Crypto', taxRate: -11, modifiedDate: '2025-04-15' },
  { name: '749333461639', type: 'Crypto', taxRate: -11, modifiedDate: '2025-04-11' },
  { name: '619074278315', type: 'Crypto', taxRate: -11, modifiedDate: '2025-04-11' },
  { name: '513933449949', type: 'Crypto', taxRate: -16, modifiedDate: '2025-04-08' },
  { name: '581699396447', type: 'Crypto', taxRate: -11, modifiedDate: '2025-04-08' }
];


  const handleActionClick = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns = [
    { field: 'modifiedDate', headerName: 'ModifiedDate' },
    { field: 'taxRate', headerName: 'Tax Rate' },
    { field: 'type', headerName: 'Type' },
    { field: 'name', headerName: 'Name' },
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

      <GenericTable columns={columns} data={feeData} />

      <CustomModal open={open} onClose={handleClose} title="Fee Details" sx={{backgroundColor: theme.palette.background.default }}>
        <div className="header-divider" />
      
        <Box sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>modifiedDate:</strong></Typography>
            <Typography>{selectedRow?.modifiedDate}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>Type:</strong></Typography>
            <Typography>{selectedRow?.type}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>Tax-Rate:</strong></Typography>
            <Typography>{selectedRow?.taxRate}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography><strong>Name:</strong></Typography>
            <Typography>${selectedRow?.name}</Typography>
          </Box>

          <CustomButton onClick={handleClose}>Close</CustomButton>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default FirstSection;
