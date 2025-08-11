import React, { useState } from 'react';
import { Box, Link, Dialog, useTheme } from '@mui/material';
import SumsubKYC from '../SumsubKyc/main'; 

const UpdateKYC = () => {
  const theme = useTheme();
  const [kycOpen, setKycOpen] = useState(false);

  return (
    <Box className="dashboard-container" sx={{ backgroundColor: theme.palette.background.default }} >
      {/* Hyperlink */}
      <Link
        component="button"
        variant="body1"
        underline="always"
        color="primary"
        sx={{ cursor: 'pointer', fontWeight: 600 }}
        onClick={() => setKycOpen(true)}
      >
        Update KYC
      </Link>

      {/* Modal */}
      <Dialog
        open={kycOpen}
        onClose={() => setKycOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { minHeight: 480 } }}
      >
        <SumsubKYC />
      </Dialog>
    </Box>
  );
};

export default UpdateKYC;
