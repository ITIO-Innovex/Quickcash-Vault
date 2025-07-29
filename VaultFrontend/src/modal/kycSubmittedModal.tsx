
import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomModal from '@/components/CustomModal';

interface KYCSubmittedModalProps {
  open: boolean;
  onClose: () => void;
}

const KYCSubmittedModal: React.FC<KYCSubmittedModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title=""
      maxWidth="sm"
    >
      <Box className="kyc-submitted-container">
        <Box className="kyc-submitted-icon">
          <Box className="check-icon">✓</Box>
        </Box>
        
        <Typography variant="h5" className="kyc-submitted-title">
          KYC form is submitted successfully
        </Typography>
        
        <Typography className="kyc-submitted-description">
          Your submission is now under review by our administration team.
          Please allow some time for the approval process. You will receive an
          email notification once your verification has been completed.
        </Typography>
      </Box>
    </CustomModal>
  );
};

export default KYCSubmittedModal;
