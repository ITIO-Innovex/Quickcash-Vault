import React from 'react';
import Title from '../../../components/common/Title';
import { Box, Button, Grid } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import DocumentsTable from './DocumentsTable';

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: '#483594',
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: '#3c2c7a',
  },
}));

const buttonList = [
  {
    label: 'Sign yourself',
    redirectId: 'sHAnZphf69',
    redirectType: 'Form',
    icon: <CreateIcon />,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <React.Fragment>
      <Box
        className="dashboard-container"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Title title="Digital-signature Dashboard" />
        <Box sx={{ mt: 5 }}>
          <Grid container spacing={2} data-tut="tourbutton">
            {buttonList.map((btn) => (
              <Grid item xs={12} md={6} key={btn.label}>
                <StyledButton
                  fullWidth
                  variant="contained"
                  startIcon={btn.icon}
                  onClick={() => {
                    navigate('/digital-signature/sign-yourself-form');
                  }}
                >
                  {btn.label}
                </StyledButton>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Table section */}
        <DocumentsTable />
      </Box>
    </React.Fragment>
  );
};

export default Dashboard;
