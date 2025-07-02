import { Box, Typography, useTheme } from '@mui/material';
import LeftBox1 from "./FirstLeftSection";
import LeftBox2 from "./SecondLeftSection";
import LeftBox3 from "./ThirdLeftSection";
import LeftBox4 from "./FourthLeftSection";	
import RightBox3 from "./ThirdRightSection";
import RightBox1 from "./FirstRigthSection";   
import RightBox2 from "./SecondRightSection";
import MarqueeSection from '@/components/common/marquee';
import PageHeader from '@/components/common/pageHeader';

const adminDashboard = () => {
  const theme = useTheme();
 
  return (
    <Box
      className="dashboard-container"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
    <PageHeader title='Admin-dashboard'/>
      {/* Marquee */}
      <MarqueeSection/>
      <Box className="dashboard-flex-container">
        {/* Left Column */}
        <Box className="dashboard-left-column">
          <LeftBox1 />
          <LeftBox2 />
          <LeftBox3 />
          <LeftBox4 />
        </Box>

        {/* Right Column */}
        <Box className="dashboard-right-column">
          <RightBox1 />
          <RightBox2 />
          <RightBox3 />
        </Box>
      </Box>
    </Box>
  );
};

export default adminDashboard;
