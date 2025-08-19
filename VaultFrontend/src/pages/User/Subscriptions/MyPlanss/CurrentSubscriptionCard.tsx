import dayjs from 'dayjs';
import api from '@/helpers/apiHelper';
import Link from '@mui/material/Link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CustomNoteBox from '@/components/CustomNote';
import CommonLoader from '@/components/CommonLoader';
import { Link as RouterLink } from 'react-router-dom';
const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";
import { Card, CardContent, Typography, Chip, Box, useTheme } from '@mui/material';

const CurrentSubscriptionCard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
          const response = await api.get(`${url}/subscription/current`, {
            headers: { Authorization: `Bearer ${token}` },
              }); 
            setSubscription(response.data.data);
            const subscriptionName = response.data.data.subscriptionDetails.name;
            localStorage.setItem('subscriptionName', subscriptionName);  
        } catch (error) {
          console.error('❌ Error fetching current subscription:', error);
        }finally {
          setLoading(false); 
        }
    };

    fetchCurrentSubscription();
  }, []);

  if (loading) {
  return <CommonLoader show={true} />;
  }
  
  if (!subscription) {
  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, p: 3 }}>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
            You haven’t subscribed to any of the subscriptions yet.
          </Typography>
          <Link component={RouterLink} to="/all-plans" color="primary" underline="always" style={{ cursor: 'pointer', fontWeight: 600 }} >
            Subscribe Now
          </Link>
    </Box>
  );
}

  const { subscriptionDetails, status, createdAt, nextPaymentDate, lastPaymentInvoiceStatus } = subscription;
 return (
    <Box className="dashboard-container" sx={{ backgroundColor: theme.palette.background.default }}>
    <CustomNoteBox>
    Before paying the invoice, make sure you have generated and topped up your wallet. We recommend topping up and making the payment using ETH.<Link component={RouterLink} to="/blockchain" color="primary" underline="always" style={{ cursor: 'pointer', fontWeight: 600 }}>
    Go to Blockchain
    </Link>
    </CustomNoteBox>
    
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glossy-wrapper">
    <Card className="subscription-card">

      <span className="shine" />
      <CardContent className="card-content animate-fade-in">
        <Typography variant="h5" className="plan-name">{subscriptionDetails?.name}</Typography>
        <Typography className="plan-desc">{subscriptionDetails?.description}</Typography>

        <div className="row">
          <span>Amount:</span>
          <strong>${subscriptionDetails?.amount}</strong>
        </div>
        <div className="row">
          <span>Initial Payment:</span>
          <strong>${subscriptionDetails?.initialPaymentAmount}</strong>
        </div>
        <div className="row">
          <span>Currency:</span>
          <strong>{subscriptionDetails?.currency}</strong>
        </div>
        <div className="row">
          <span>Interval:</span>
          <strong>{subscriptionDetails?.subscriptionInterval}</strong>
        </div>
        <div className="row">
          <span>Trial Available:</span>
          <strong>{subscriptionDetails?.trialAvailable ? 'Yes' : 'No'}</strong>
        </div>
        <div className="row">
          <span>Level:</span>
          <strong>{subscriptionDetails?.level}</strong>
        </div>

        <div className="row">
          <span>Status:</span>
          <Chip label={status} className={`status-chip ${status.toLowerCase()}`} />
        </div>
        <div className="row">
          <span>Invoice Status:</span>
          <strong>{lastPaymentInvoiceStatus}</strong>
        </div>
        <div className="row">
          <span>Created At:</span>
          <strong>{dayjs(createdAt).format('DD MMM YYYY')}</strong>
        </div>
        <div className="row">
          <span>Next Payment:</span>
          <strong>{dayjs(nextPaymentDate).format('DD MMM YYYY')}</strong>
        </div>
      </CardContent>
    </Card>
    </motion.div>
    </Box>
    
  );
};

export default CurrentSubscriptionCard;
