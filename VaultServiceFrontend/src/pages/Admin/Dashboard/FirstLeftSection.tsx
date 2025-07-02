import PersonIcon from '@mui/icons-material/Person';
import { Box, Grid, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';


const cardData = [
  { icon: <PersonIcon fontSize="large" />, value: 207, label: 'Total Account' },
  { icon: <HourglassEmptyIcon fontSize="large" />, value: 8, label: 'Total Wallet' },
  { icon: <BarChartIcon fontSize="large" />, value: '$1321.84', label: 'Total Transactions' },
];

const FirstLeftSection = () => {
  return (
    <Box className="dashboard-box left-section">
      <Grid container spacing={2}>
        {cardData.map((card, idx) => (
          <Grid item xs={12} sm={6} md={12} key={idx}>
            <Box className="metric-card">
              <div className="metric-icon">{card.icon}</div>
              <div className="metric-info">
                <Typography className="metric-value">{card.value}</Typography>
                <Typography className="metric-label">{card.label}</Typography>
              </div>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FirstLeftSection;
