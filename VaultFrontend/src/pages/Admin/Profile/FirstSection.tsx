import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Edit } from 'lucide-react';
import CustomButton from '@/components/CustomButton';

const FirstSection = () => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageName, setImageName] = useState<string>('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateClick = () => {
    // Trigger your update logic here (e.g., API call)
    console.log('Update clicked. Selected image name:', imageName);
  };

  const userDetails = [
    { label: 'FIRST NAME:', value: 'Rashmi' },
    { label: 'LAST NAME:', value: 'Srivastava' },
    { label: 'EMAIL:', value: 'noconnect.noreply@gmail.com' },
    { label: 'MOBILE:', value: '+919717990527' },
    { label: 'PASSWORD:', value: '****' },
  ];

  return (
    <Box
      sx={{
        p: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 4,
          alignItems: isMobile ? 'center' : 'flex-start',
        }}
      >
        {/* Profile Picture Section */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Avatar
            src={selectedImage || undefined}
            sx={{
              width: 120,
              height: 120,
              backgroundColor: theme.palette.grey[400],
              fontSize: '3rem',
            }}
          >
            {!selectedImage && '👤'}
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          {imageName && (
            <Typography
              variant="caption"
              sx={{ mt: 1, color: theme.palette.text.secondary }}
            >
              {imageName}
            </Typography>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 1,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <CustomButton
              variant="contained"
              size="small"
              onClick={handleUpdateClick}
            >
              UPDATE
            </CustomButton>

            <IconButton
              onClick={handleEditClick}
              sx={{
                backgroundColor: '#483594',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: '#3d2a7a',
                },
              }}
            >
              <Edit size={14} />
            </IconButton>
          </Box>
        </Box>

        {/* Admin Details Section */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: 2,
            }}
          >
            {userDetails.map((detail, index) => (
              <Box key={index}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  {detail.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      detail.value === '-'
                        ? theme.palette.text.disabled
                        : theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  {detail.value}
                </Typography>
                <Box
                  component="hr"
                  sx={{
                    border: 0,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    mb: 1,
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FirstSection;
