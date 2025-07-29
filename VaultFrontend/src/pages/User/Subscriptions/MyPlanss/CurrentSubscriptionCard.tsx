import axios from 'axios';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CurrentSubscriptionCard = () => {
 const [subscription, setSubscription] = useState<any>(null);
  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token not found in localStorage");
        return;
      }
          const response = await axios.get(`${API_URL}/subscription/current`, {
                headers: { Authorization: `Bearer ${token}` },
              }); 
        setSubscription(response.data.data);
      } catch (error) {
        console.error('❌ Error fetching current subscription:', error);
      }
    };

    fetchCurrentSubscription();
  }, []);

  if (!subscription) return null;

  const { subscriptionDetails, status, createdAt, nextPaymentDate, lastPaymentInvoiceStatus } = subscription;
 return (
    <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="glossy-wrapper"
  >
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
  );
};

export default CurrentSubscriptionCard;
