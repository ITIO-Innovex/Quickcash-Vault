
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import {
  Box,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import './sendMoney.css';
import SelectDestinationStep from './SelectDestinationStep';
import CurrencySelectionStep from './CurrencySelectionStep';
import TransferMethodStep from './TransferMethodStep';
import TransferDetailsStep from './TransferDetailsStep';

// Define beneficiary interface for type safety
interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  country: string;
  currency: string;
  avatar?: string;
}

// Main Send Money Component - Handles the multi-step money transfer process
const SendMoney = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [formData, setFormData] = useState({
    selectedCountry: '',
    fromCurrency: 'USD',
    toCurrency: '',
    sendAmount: '1000',
    receiveAmount: '',
    receivingOption: 'bank_account', // Set statically
    transferMethod: '',
    beneficiaryData: {},
  });

  // Step labels for the stepper component
  const steps = ['Select Destination', 'Select Currencies', 'Transfer Method', 'Transfer Details'];

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateFormData = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Navigate to separate beneficiary selection page
  const handleBeneficiaryTab = () => {
    navigate("/beneficiary", { 
      state: { 
        returnToSendMoney: true 
      } 
    });
  };

  // Handle beneficiary selection and move to currency step
  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    updateFormData({
      toCurrency: beneficiary.currency,
      selectedCountry: beneficiary.country,
      beneficiaryData: beneficiary
    });
    setActiveStep(1); // Move to currency selection step
  };

  // Listen for beneficiary selection from navigation state
  useEffect(() => {
    if (location.state?.selectedBeneficiary) {
      const beneficiary = location.state.selectedBeneficiary;
      handleBeneficiarySelect(beneficiary);
      // Clear the state to prevent re-triggering
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Step 1: Destination Selection Component - Choose country or go to beneficiary selection
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <SelectDestinationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBeneficiaryTab={handleBeneficiaryTab}
            onSelectBeneficiary={handleBeneficiarySelect}
          />
        );
      case 1:
        // Step 2: Currency Selection Component - Choose send/receive currencies and amounts
        return (
          <CurrencySelectionStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            selectedBeneficiary={selectedBeneficiary}
          />
        );
      case 2:
        // Step 3: Transfer Method Component - Choose how to send money (bank, card, etc.)
        return (
          <TransferMethodStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        // Step 4: Transfer Details Component - Final confirmation and payment details
        return (
          <TransferDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box className="send-money-container">
      {/* Header Section */}
      <Box className="send-money-header">
          {/* <Typography variant="subtitle1" className="header-subtitle" sx={{color:theme.palette.text.gray}}>
            Fast, secure money transfers worldwide
          </Typography> */}
      </Box>

      {/* Stepper Navigation - Shows current step progress */}
      <Box className="stepper-container">
        <Stepper 
          activeStep={activeStep} 
          className="send-money-stepper"
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{
            '& .MuiStepConnector-root': {
              ...(isMobile && {
                marginLeft: '12px',
                minHeight: '30px',
              }),
            },
            '& .MuiStepLabel-root': {
              ...(isMobile && {
                padding: '8px 0',
              }),
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                className={`step-label ${index <= activeStep ? 'active' : ''}`}
              >
                <Typography className="step-text" sx={{color:theme.palette.text.gray}}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>  
      </Box>

      {/* Step Content - Renders the current step component */}
      <Box className="step-content">
        {renderStepContent()}
      </Box>
    </Box>
  );
};

export default SendMoney;
