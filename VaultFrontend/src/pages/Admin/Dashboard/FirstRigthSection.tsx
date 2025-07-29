import { DollarSign } from 'lucide-react';
import 'react-circular-progressbar/dist/styles.css';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { CircularProgressbarWithChildren,buildStyles, } from 'react-circular-progressbar';


const stats = [
  {
    label: 'Credit',
    value: 3228.13,
    percent: 75,
    color: '#2dd4bf',
    icon: <ArrowUpward sx={{ fontSize: 32, color: '#2dd4bf' }} />,
  },
  {
    label: 'Debit',
    value: 1620.12,
    percent: 25,
    color: '#f97316',
    icon: <ArrowDownward sx={{ fontSize: 32, color: '#f97316' }} />,
  },
  {
    label: 'Revenue',
    value: 182886.49,
    percent: 95,
    color: '#4d7c0f',
    icon: <DollarSign size={32} color="#4d7c0f" />,
  },
];

const FirstRightSection = () => {
  const theme = useTheme();
  return (
    <Box className="dashboard-box">
      <Grid container spacing={10}>
        {stats.map((stat) => (
          <Grid item   xs={12} sm={4} key={stat.label}>
            <Paper className="top-charts" sx={{backgroundColor:theme.palette.background.default}}>
              <Box className="chart-start">
                <div className={`progressbar-wrapper ${stat.color}`}>
                 <CircularProgressbarWithChildren
                    value={stat.percent}
                    strokeWidth={10}
                    styles={buildStyles({
                    pathColor: stat.color,
                    trailColor: '#e5e7eb',
                    })}
                    >
                    <Box className="progress-content">
                      {stat.icon}
                      <Typography variant="subtitle2" fontWeight="bold">
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${stat.value.toLocaleString()}
                      </Typography>
                    </Box>
                  </CircularProgressbarWithChildren>
                </div>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FirstRightSection;
