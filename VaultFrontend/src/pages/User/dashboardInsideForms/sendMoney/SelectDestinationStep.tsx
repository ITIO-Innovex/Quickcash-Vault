
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import CustomButton from '@/components/CustomButton';
import CountryCard from '@/components/CountryCard';
import CountryDropdown from '@/components/CountryDropdown';

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  country: string;
  currency: string;
}

interface SelectDestinationStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBeneficiaryTab: () => void;
  onSelectBeneficiary?: (beneficiary: Beneficiary) => void;
}

// Step 1: Destination Selection Component - Choose destination country or select existing beneficiary
const SelectDestinationStep: React.FC<SelectDestinationStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onBeneficiaryTab,
  onSelectBeneficiary,
}) => {
  const theme  = useTheme();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(formData.selectedCountry || '');
  const [activeTab, setActiveTab] = useState(0);

  // Featured countries displayed as cards
  const featuredCountries = [
    { code: 'USD', name: 'United States', currency: 'USD', flagCode: 'US' },
    { code: 'INR', name: 'India', currency: 'INR', flagCode: 'IN' },
    { code: 'CAD', name: 'Canada', currency: 'CAD', flagCode: 'CA' },
    { code: 'AUD', name: 'Australia', currency: 'AUD', flagCode: 'AU' },
  ];

  // Other countries available in dropdown
  const otherCountries = [
    { code: 'GBP', name: 'United Kingdom', currency: 'GBP', flagCode: 'GB' },
    { code: 'JPY', name: 'Japan', currency: 'JPY', flagCode: 'JP' },
    { code: 'CHF', name: 'Switzerland', currency: 'CHF', flagCode: 'CH' },
    { code: 'SGD', name: 'Singapore', currency: 'SGD', flagCode: 'SG' },
    { code: 'EUR', name: 'Germany', currency: 'EUR', flagCode: 'DE' },
    { code: 'EUR', name: 'France', currency: 'EUR', flagCode: 'FR' },
  ];

  // Filter out featured currencies from dropdown to avoid duplicates
  const filteredOtherCountries = otherCountries.filter(
    country => !featuredCountries.some(featured => featured.currency === country.currency)
  );

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    
    // If user clicks on beneficiary tab, navigate to beneficiary page
    if (newValue === 1) {
      onBeneficiaryTab();
    }
  };

  const handleContinue = () => {
    if (selectedCountry) {
      updateFormData({ 
        selectedCountry,
        toCurrency: selectedCountry 
      });
      onNext();
    }
  };

  const isFeaturedSelected = featuredCountries.some(country => country.currency === selectedCountry);

  return (
    <Box className="destination-step">
      <Typography variant="h6" className="step-title" sx={{color:theme.palette.text.primary}}>
        Where do you want to send money?
      </Typography>
      <Typography variant="body2" className="step-description" sx={{color:theme.palette.text.gray}}>
        Select your destination country or choose from existing beneficiaries
      </Typography>

      {/* Tab Navigation - Switch between currency selection and beneficiary selection */}
      <Box className="tab-navigation">
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          className="destination-tabs"
          centered
        >
          <Tab label="Select Currency" />
          <Tab label="Select Beneficiary" sx={{color:theme.palette.text.primary}} />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box className="currency-content">
          {/* Featured Currency Cards - Quick selection for popular countries */}
          <Grid container spacing={3} className="country-cards" >
            {featuredCountries.map((country) => (
              <Grid item xs={12} sm={6} md={3} key={country.code}  >
                <CountryCard 
                  countryCode={country.code}
                  countryName={country.name}
                  currency={country.currency}
                  flagCode={country.flagCode}
                  selected={selectedCountry === country.currency}
                  onClick={() => handleCountrySelect(country.currency)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Other Countries Dropdown - All other available destinations */}
          <Box className="other-countries" sx={{ mt: 3 }}>
            <Typography variant="subtitle1" className="other-countries-label" sx={{ mb: 2 }}>
              Select Other Countries
            </Typography>
           <CountryDropdown
              label="Select other destination country"
              countries={filteredOtherCountries}
              value={!isFeaturedSelected ? selectedCountry : ''}
              onChange={(e) => {
                const value = e.target.value as string;
                setSelectedCountry(value);
                updateFormData({
                  selectedCountry: value,
                  toCurrency: value,
                });
              }}
            />
          </Box>

          {/* Continue Button - Proceed to next step */}
          <Box className="step-actions" sx={{ mt: 4 }}>
            <CustomButton
              onClick={handleContinue}
              disabled={!selectedCountry}
              fullWidth
              className="continue-button"
            >
              Continue
            </CustomButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SelectDestinationStep;
