import api from '@/helpers/apiHelper';
import React, { useState } from 'react';
import { useAppToast } from '@/utils/Toast';
import CustomModal from '@/components/CustomModal';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInputField';
import { Tabs, Tab, Box, Typography, Button } from '@mui/material';
const url = import.meta.env.VITE_NODE_ENV === 'production' ? 'api' : 'api';

const CardOffer = ({ cardId: propCardId, card }) => {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Form fields state
  const toast = useAppToast();
  const [tab, setTab] = useState(1); // 1 = "Physical Card" by default
  const [cardId, setCardId] = useState('');
  const [activationCode, setActivationCode] = useState('');

   // Optional: fill cardId on open (to show current card's id by default)
  const handleActivateClick = () => {
    setCardId( propCardId|| ''); // Or pass '' if no id
    setActivationCode('');
    setModalOpen(true);
  };

  const handleModalClose = () => setModalOpen(false);

  
  // API HIT FUNCTION
  const handleActivateSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Activation:', { cardId, activationCode });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found in localStorage");
        return;
      }
      const res = await api.post(`${url}/card/${cardId}/activate`, 
        { activationCode },
      );
      console.log("Activation API response:", res.data);
      setModalOpen(false);

    }catch (err) {
    // If backend sends a message in response
    let errorMsg = "Something went wrong!";
    if (err.response && err.response.data && err.response.data.message) {
      errorMsg = err.response.data.message;
    }
    // Toast show karo
    toast.error(errorMsg);
    // Optional: console me log bhi rakh lo
    console.error("Activate Card API error:", err);
  }
  };
  return (
    <Box className="tab-root">
      <Tabs value={tab} onChange={(_, v) => setTab(v)} className="tabs" TabIndicatorProps={{ className: 'tab-indicator' }}>
        <Tab label="Virtual Card" className="tab" />
        <Tab label="Physical Card" className="tab" />
      </Tabs>
      <Box className="tab-panel">
        {tab === 0 && (
          <Box>
            <Typography variant="h6" className="tab-title">
              A virtual card for instant access
            </Typography>
            <Typography className="tab-content">
              Use your <b>Virtual Card</b> for secure online transactions, payments, and subscriptions.
              No waiting — your card is instantly generated and can be used globally wherever cards are accepted online.<br /><br />
              - Instant issue, no delivery delays<br />
              - Add to your digital wallet for convenience<br />
              - Freeze or manage anytime from your dashboard
            </Typography>
            {/* No button here! */}
          </Box>
        )}
        {tab === 1 && (
          <Box>
            <Typography variant="h6" className="tab-title">
              Access your funds globally
            </Typography>
            <Typography className="tab-content">
              Access your funds globally without all the costs and time.<br />
              Your <b>Physical card</b> will arrive anywhere from <b>3-5 business days</b>.<br /><br />
              <span style={{ color: '#6C4AB6' }}>Shop in-store, withdraw cash, travel, and more!</span>
            </Typography>

            <Button variant="contained" className="card-action-btn" fullWidth onClick={handleActivateClick} sx={{ mt: 4 }} > Activate Plastic Card </Button>
          </Box>
        )}
      </Box>

       {/* Activate Card Modal */}
      <CustomModal open={modalOpen} onClose={handleModalClose} disableBackdropClick={true} title="Activate Card">
          <form onSubmit={handleActivateSubmit} className="activate-form">

            <CustomInput className="form-input" type="text" value={cardId} onChange={e => setCardId(e.target.value)} label="Card Id" disabled/>
            
            <CustomInput className="form-input" type="text" value={activationCode} onChange={e => setActivationCode(e.target.value)} label="Activation Code" required/>
            
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <CustomButton className="form-submit-btn" onClick={handleActivateSubmit} type="submit"> Activate </CustomButton>
            </Box>

        </form>
      </CustomModal>
    </Box>
  );
}

export default CardOffer;
