
import React, { useState } from 'react';
import ViewClientModal from './ViewClientModal';
import CommonFilter from '@/components/CustomFilter';
import { Eye, Edit, Trash2, Filter } from 'lucide-react';
import { Box, Button, Typography, useTheme} from '@mui/material';
import CustomModal from '../../../components/CustomModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GenericTable from '../../../components/common/genericTable';
import CustomButton from '@/components/CustomButton';


const FirstSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const handleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const mockData = [
    {
      id: 1,
      createdDate: '2025-02-17',
      clientName: 'John Doe',
      email: 'john.doe@test.com',
      mobile: '+491761234567',
      postalCode: '12345',
      country: 'Germany',
      state: 'Berlin',
      city: 'Berlin',
      address: '123 Main Street',
      notes: 'Important client'
    },
    {
      id: 2,
      createdDate: '2025-02-16',
      clientName: 'Jane Smith',
      email: 'jane.smith@test.com',
      mobile: '+491761234568',
      postalCode: '54321',
      country: 'Germany',
      state: 'Munich',
      city: 'Munich',
      address: '456 Oak Avenue',
      notes: 'Regular client'
    }
  ];

 
  const handleGlobalSearch = (text: string) => {
  setFilterText(text);

  if (text.trim() === '') {
    setCurrentData(mockData);
    return;
  }

  const lower = text.toLowerCase();

  const filtered = mockData.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(lower)
    )
  );

  setCurrentData(filtered.length ? filtered : []);
  console.log('Filtering by:', text, '→ Found:', filtered.length, 'items');
};


  const [currentData, setCurrentData] = useState(mockData);
  

  const handleOpen = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns = [
    {
      field: 'createdDate',
      headerName: 'Created Date'
    },
    {
      field: 'clientName',
      headerName: 'Client Name'
    },
    {
      field: 'email',
      headerName: 'Email'
    },
    {
      field: 'mobile',
      headerName: 'Mobile'
    },
    {
      field: 'country',
      headerName: 'Country'
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

  function setViewModalOpen(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Box 
      className="clients-table-section"
      sx={{ 
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary 
      }}
    >
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

      <CustomModal
        open={open}
        onClose={handleClose}
        title="Client Details"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
         <div className="header-divider" />
                {selectedRow && (
                  <>
                    <Box display="flex" justifyContent="space-between" mb={2} mt={4}>
                      <Typography><strong>Created Date:</strong></Typography>
                      <Typography>{selectedRow.createdDate}</Typography>
                    </Box>
        
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Client Name:</strong></Typography>
                      <Typography>{selectedRow.clientName}</Typography>
                    </Box>
        
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Email:</strong></Typography>
                      <Typography>{selectedRow.email}</Typography>
                    </Box>
        
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Mobile:</strong></Typography>
                      <Typography>{selectedRow.mobile}</Typography>
                    </Box>
        
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography><strong>Country:</strong></Typography>
                      <Typography>{selectedRow.country}</Typography>
                    </Box>
        
                    <CustomButton
                      onClick={handleClose}
                    >
                      <span className="button-text">Close</span>
                    </CustomButton>
                  </>
                )}
              </CustomModal>


        <ViewClientModal 
          client={selectedClient}
          onClose={() => setViewModalOpen(false)}
        />
    </Box>
  );
};

export default FirstSection;
