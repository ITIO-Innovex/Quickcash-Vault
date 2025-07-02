import { Box, Grid, Typography } from '@mui/material';
import { User, Banknote, Wallet } from 'lucide-react';

const stats = [
  {
    label: 'Total Users',
    value: 201,
    icon: <User className="stat-icon" />,
    className: 'card-green',
  },
  {
    label: 'New Users',
    value: 4,
    icon: <Banknote className="stat-icon" />,
    className: 'card-teal',
  },
  {
    label: 'Pending Users',
    value: 197,
    icon: <Wallet className="stat-icon" />,
    className: 'card-blue',
  },
];

const SecondRightSection = () => {
  return (
    <Box className="dashboard-box">
      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Box className={`stat-card ${stat.className}`}>
              <Box className="stat-content">
                <Box className="stat-text">
                  <Typography variant="h6" className="stat-value">
                    {stat.value}
                  </Typography>
                  <Typography className="stat-label">{stat.label}</Typography>
                </Box>
                <Box className="stat-icon-box">{stat.icon}</Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SecondRightSection;
