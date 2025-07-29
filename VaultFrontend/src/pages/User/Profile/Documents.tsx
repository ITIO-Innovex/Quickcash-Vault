
import React, { useState } from 'react';
import { Box, Typography, Grid, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Upload } from 'lucide-react';
import CustomInput from '../../../components/CustomInputField';
import CustomSelect from '../../../components/CustomDropdown';
import CustomButton from '../../../components/CustomButton';

const Documents = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    documentId: '1234',
    idType: 'driving-license'
  });
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedDocument(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Document form submitted:', formData, uploadedDocument);
  };

  const idTypeOptions = [
    { label: 'Driving License', value: 'driving-license' },
    { label: 'Passport', value: 'passport' },
    { label: 'National ID', value: 'national-id' },
    { label: 'Social Security Card', value: 'ssn' }
  ];

  return (
    <Box className="documents-container">
      <Typography variant="h6" className="documents-title">
        Documents
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} className="documents-form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CustomInput
              label="Document ID No"
              value={formData.documentId}
              onChange={(e) => handleInputChange('documentId', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CustomSelect
              label="ID of Individual"
              options={idTypeOptions}
              value={formData.idType}
              onChange={(e) => handleInputChange('idType', e.target.value as string)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box className="document-upload-section">
              <Typography variant="body2" className="upload-label">
                Please upload document
              </Typography>
              
              <Box className="upload-area">
                <input
                  type="file"
                  id="document-upload"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="upload-input"
                />
                <label htmlFor="document-upload" className="upload-label-clickable">
                  <Box className="upload-content">
                    <Avatar className="upload-avatar">
                      <Upload size={24} />
                    </Avatar>
                    <Typography variant="body2" className="upload-text">
                      Click here to upload new document
                    </Typography>
                  </Box>
                </label>
              </Box>
              
              <Typography variant="caption" className="upload-note">
                Note: Click over the Image in order to change the existing Document
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <CustomButton
              type="submit"
              className="documents-button"
            >
              UPDATE
            </CustomButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Documents;
