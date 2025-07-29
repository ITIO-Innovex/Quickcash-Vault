
import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomInput from '../../../components/CustomInputField';
import CustomSelect from '../../../components/CustomDropdown';
import CustomButton from '../../../components/CustomButton';

const UpdateDetails = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: 'dummy1',
    email: 'dummy1@gmail.com',
    mobile: '+1 (234) 567-898',
    address: '',
    country: '',
    state: '',
    postalCode: '',
    title: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'India', value: 'IN' }
  ];

  const stateOptions = [
    { label: 'California', value: 'CA' },
    { label: 'New York', value: 'NY' },
    { label: 'Texas', value: 'TX' },
    { label: 'Florida', value: 'FL' }
  ];

  const titleOptions = [
    { label: 'Mr.', value: 'mr' },
    { label: 'Mrs.', value: 'mrs' },
    { label: 'Ms.', value: 'ms' },
    { label: 'Dr.', value: 'dr' }
  ];

  return (
    <Box className="update-details-container">
      <Typography variant="h6" className="update-details-title">
        Update Details
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} className="update-details-form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CustomInput
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CustomInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CustomInput
              label="Mobile"
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CustomInput
              label="Address"
              multiline
              rows={1}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CustomSelect
              label="Country"
              options={countryOptions}
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value as string)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CustomSelect
              label="State"
              options={stateOptions}
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value as string)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CustomInput
              label="Postal Code"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CustomSelect
              label="Title"
              options={titleOptions}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value as string)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <CustomButton
              type="submit"
              className="update-details-button"
            >
              UPDATE
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UpdateDetails;
