import PageHeader from '@/components/common/pageHeader';
import { Box, useTheme } from '@mui/material'
import SubscriptionList from './Plans';

const main = () => {
    const theme = useTheme();
  return (
   <Box className="dashboard-container" sx={{ backgroundColor: theme.palette.background.default }}>
      <PageHeader title="Available Plans"/>
      
      <SubscriptionList />
      </Box>
  )
}

export default main