import { Box, Typography, useTheme } from '@mui/material';
import FirstSection from './FirstSection';


const main = () => {
  const theme = useTheme();

  return (
      <Box  className="dashboard-container"
        sx={{ backgroundColor: theme.palette.background.default }}>
          <Typography variant="h5" component="h1" className='stats-heading'>
                   Transaction List
          </Typography>
          <FirstSection />
      </Box>
    )
  }

export default main