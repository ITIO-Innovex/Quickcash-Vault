import clsx from 'clsx';
import axios from 'axios';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CommonTooltip from '@/components/common/toolTip';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import './Account-card.css';

interface AccountCardProps {
  account: string;
  accountType: string;
  shortName?: string;
  status: string;
  onClick?: () => void;
}

const AccountCard = ({ account, accountType, shortName, status }: AccountCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleCardClick = async () => {
    if (!flipped) {
      try {
        const res = await axios.get(`${API_URL}/wallet/account/${account}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        setDetails(res.data.data);
      } catch (err) {
        console.error('❌ Failed to fetch account details:', err);
      }
    }
    setFlipped((prev) => !prev);
  };

  return (
    <CommonTooltip title="Click to see details" arrow placement="top">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Box className="card-wrappers" onClick={handleCardClick}>
          <Box className={clsx('flip-card-inner', flipped && 'flipped')}>
            {/* FRONT */}
            <Card className={clsx('account-cards front', status.toLowerCase())}>
              <span className="shine" />
              <CardContent>
                <Typography variant="h6" className="account-type">Account Id</Typography>
                <Typography className="account-id">{account}</Typography>
                <Chip label={status} className={clsx('account-status', status.toLowerCase())} />
              </CardContent>
            </Card>

            {/* BACK */}
            <Card className="account-cards back">
              <CardContent>
                {details ? (
                  <>
                    <Typography variant="h6">Account Details</Typography>
                    <Typography>Account ID: {details.account}</Typography>
                    <Typography>Type: {details.accountType}</Typography>
                    <Typography>Short Name: {details.shortName || 'N/A'}</Typography>
                    <Typography>Status: {details.status}</Typography>
                  </>
                ) : (
                  <Typography>Loading details...</Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </motion.div>
    </CommonTooltip>
  );
};

export default AccountCard;
