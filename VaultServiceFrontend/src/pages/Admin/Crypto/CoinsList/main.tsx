import { useState } from 'react';
import FirstSection from './FirstSection';
import { Box, useTheme } from '@mui/material';
import CustomModal from '@/components/CustomModal';
import PageHeader from '@/components/common/pageHeader';
import CreateCoinForm from '@/components/forms/AddCoinForm';


const main = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
      <Box  className="dashboard-container"
        sx={{ backgroundColor: theme.palette.background.default }}>
           <PageHeader title='Coin List' buttonText='New Coin' onButtonClick={handleOpen} />
          <FirstSection />

           <CustomModal open={open} onClose={handleClose} title="Add Sub-Admin" sx={{backgroundColor: theme.palette.background.default }}>
              <CreateCoinForm onClose={handleClose} />
            </CustomModal>
      </Box>
    )
  }

export default main