import axios from 'axios';
import api from '@/helpers/apiHelper';
import { useEffect, useState } from 'react';
import { useAppToast } from '@/utils/Toast';
import { Box, FormControl } from '@mui/material';
import CustomModal from '@/components/CustomModal';
import CustomNoteBox from '@/components/CustomNote';
import CustomButton from '@/components/CustomButton';
import CustomSelect from '@/components/CustomDropdown';
import CustomInput from '@/components/CustomInputField';

const url = import.meta.env.VITE_NODE_ENV === 'production' ? 'api' : 'api';

const CardDetail = ({ cards, setCards, current, setCurrent }) => {
  const toast = useAppToast();
  const [pin, setPin] = useState('');
  const currentCard = cards[current]; 
  const [cardId, setCardId] = useState('');
  const [cardName, setCardName] = useState(''); 
  const [isFlipped, setIsFlipped] = useState(false);
  const handleCardClick = () => setIsFlipped(!isFlipped);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [secretQuestion, setSecretQuestion] = useState('');
  const [requiredStatus, setRequiredStatus] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [secretQuestionAnswer, setSecretQuestionAnswer] = useState(''); 
  const next = () => setCurrent((curr) => (curr + 1) % cards.length);
  const prev = () => setCurrent((curr) => (curr - 1 + cards.length) % cards.length);

  // change status functionality begins
  const handleStatusClick = () => {
    setCardId(cards[current].id || '');
    setRequiredStatus('');
    setStatusModalOpen(true);
  };

  const handleStatusModalClose = () => setStatusModalOpen(false);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found in localStorage");
        return;
      }

      const res = await api.post(
        `${url}/card/${cardId}/change-status?requiredStatus=${requiredStatus}`, 
        {},  // No body data needed
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      toast.success("Card status changed successfully!");
      console.log("Change Status API response:", data);
      const updatedCards = [...cards];
      updatedCards[current].status = requiredStatus;  // Update status of the current card
      setCards(updatedCards);
      setStatusModalOpen(false);
    } catch (err) {
      let errorMsg = "Something went wrong!";
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMsg = err.response.data.errors[0].description;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      toast.error(errorMsg);
      console.error("Change Status API error:", err);
    }
  };

  // change pin functionality begins
  const handlePinClick = () => {
  setCardId(cards[current]?.id || '');
  setSecretQuestion('');
  setSecretQuestionAnswer('');
  setPin('');
  setPinModalOpen(true);
  };

  const handlePinModalClose = () => setPinModalOpen(false);

  const handlePinSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found in localStorage");
      return;
    }
    // API call
    const res = await api.put(
      `${url}/card/${cardId}/pin`,  
      { secretQuestion, secretQuestionAnswer, pin, },
    );
    toast.success("PIN set/reset successfully!");
    console.log("Set/Reset PIN API response:", res.data);
    setPinModalOpen(false);
  } catch (err) {
    let errorMsg = "Something went wrong!";
   if (err.response?.data?.errors && err.response.data.errors.length > 0) {
      errorMsg = err.response.data.errors[0].description;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
    toast.error(errorMsg);
    console.error("Set/Reset PIN API error:", err);
  }
  };
  
   // Get Card Details Function
  const handleGetCardDetails = async () => {
    const cardId = cards[current]?.id; // current card's id

    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `${url}/card/${cardId}/all-details `, { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.status ==  200){
        toast.success("Card details fetched !");
        console.log('Get Card Details API Response:', res.data);
        setCardName(res.data.cardName);
      }

    } catch (err) {
      let errorMsg = "Something went wrong!";
     if (err.response?.data?.errors && err.response.data.errors.length > 0) {
      errorMsg = err.response.data.errors[0].description;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
      toast.error(errorMsg);
      console.error("Get Card Details API error:", err);
    }
  };

  const getSensitiveDetails = async () => {
    const cardId = cards[current]?.id; // current card's id
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `${url}/card/${cardId}/sensitive-details `, { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.status ==  200){
         setCardNumber(res.data.cardNumber);
        toast.success("Card Details Fetched !.");
        console.log('Get Sensitive Details API Response:', res.data);
      } else {
        toast.error("Card details do not match.");
      }

    } catch (err) {
      let errorMsg = "Something went wrong!";
     if (err.response?.data?.errors && err.response.data.errors.length > 0) {
      errorMsg = err.response.data.errors[0].description;
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
      toast.error(errorMsg);
      console.error("Get Sensitive Details API error:", err);
    }finally {
    setLoading(false);  // End loading after API call
  }
  };

return (
<Box className="slider-outer">
  <Box className="slider-controls">
    <button className="slider-arrow" onClick={prev}>&lt;</button>

    {cards.length > 0 && (
      <Box
        className={`card-visual ${isFlipped ? 'flipped' : ''}`}
        style={{
          background: `linear-gradient(110deg, ${
            cards[current].cardDesign?.description || "#1976d2"
          }, #1d1d39 85%)`,
          cursor: "pointer"
        }}
        onClick={handleCardClick}
      >
        {/* --- Card Front --- */}
        {!isFlipped ? (
          <>
            <Box className="card-header">
              {/* Left: Flag and Card Type */}
              <Box className="card-type">
                {cards[current].cardType}
              </Box>
              <img
                alt="currency flag"
                src={`https://flagcdn.com/24x18/${cards[current].balance?.currency?.toLowerCase().slice(0, -1)}.png`}
                className="card-flag"
              />
            </Box>

            <Box className="card-details">
              {/* <Box className="card-name">
                {cards[current].cardDesign?.name}
              </Box> */}

              {/* Additional Info */}
              {/* <Box className="card-name"><strong>Card ID:</strong> {cards[current].id}</Box> */}
              <Box className="card-numbers" style={{ transition: 'all 0.5s ease-in-out' }}>
                {loading ? (
                  <span>Loading...</span> // Show loading text or a loader if needed
                ) : cardNumber ? (
                  // Show actual card number after successful API call
                  <span>{cardNumber}</span>
                ) : (
                  // Show masked number by default
                  `${Array(4).fill('*').join(' ')} ${Array(4).fill('*').join(' ')} ${Array(4).fill('*').join(' ')} ${cards[current].last4}`
                )}
              </Box>

               <Box className="card-name">
              <span>Order At : </span>
              {cards[current].orderedAt
                ? new Date(cards[current].orderedAt).toLocaleDateString()
                : "-"}
            </Box>
            <Box className="card-name">
              <strong>Card Holder Name : </strong> {cardName ? cardName : '----'}
            </Box>
            <Box className="card-name"> {cards[current].status}</Box>
            </Box>
          </>
        ) : (
          // --- Card Back ---
          <Box className="card-back">
            <Box><strong>Status:</strong> {cards[current].status}</Box>
            <Box><strong>Card Type:</strong> {cards[current].cardType}</Box>
          </Box>
          )}
        </Box>
      )}

        <button className="slider-arrow" onClick={next}>&gt;</button>
      </Box>

      <Box className="slider-dots">
        {cards.map((_, idx) => (
          <Box
            key={cards[idx].accountId || idx}
            className={`slider-dot${current === idx ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </Box>

        <Box className="card-actions-row">

        <button onClick={handleGetCardDetails} className="card-action-btn">Get Card Details</button>
        <button onClick={handleStatusClick} className="card-action-btn">Change Status</button>
        <button onClick={handlePinClick} className="card-action-btn">Set/Reset PIN</button>
        <button onClick={getSensitiveDetails} className="card-action-btn">Get Sensitive Details</button>
      </Box>

      {/* Change Status Modal */}
      <CustomModal open={statusModalOpen}  disableBackdropClick={true} onClose={handleStatusModalClose} title="Change Card Status">
        <form onSubmit={handleStatusSubmit} className="activate-form">
            <CustomInput className="form-input" type="text" value={cardId} onChange={e => setCardId(e.target.value)} label="Card ID" disabled />

            <FormControl fullWidth className="form-label">
            <CustomSelect labelId="status-label" value={requiredStatus} label="Required Status" onChange={(e) => setRequiredStatus(e.target.value as string)} required className="form-input"
            options={[
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'FROZEN', value: 'FROZEN' }
            ]}
          />
          </FormControl>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <CustomButton className="form-submit-btn"  type="submit"> Submit </CustomButton>
            </Box>
        </form>
      </CustomModal>
      
      {/* Set/Reset PIN Modal */}
      <CustomModal open={pinModalOpen} disableBackdropClick={true} onClose={handlePinModalClose} title="Set/Reset PIN">

        <form onSubmit={handlePinSubmit} className="activate-form">
        <CustomInput className="form-input" type="text" value={cardId} onChange={e => setCardId(e.target.value)} label="Card ID" disabled />

        <CustomInput className="form-input" type="text" value={secretQuestion} onChange={e => setSecretQuestion(e.target.value)} label="secret question" />
          
        <CustomInput className="form-input" type="text" value={secretQuestionAnswer} onChange={e => setSecretQuestionAnswer(e.target.value)} label="Secret Question's Answer" autoComplete='secretQuestionAnswer'/>

        <CustomInput className="form-input" type="password" value={pin} onChange={e => setPin(e.target.value)} label="PIN" required/>
          <CustomNoteBox note={true}>Card PIN Requirements: 4 digits; no more than two repeated digits in a row (e.g., 1112 is not allowed; 1122 is allowed)</CustomNoteBox>
           <Box display="flex" justifyContent="flex-end" mt={2}>
              <CustomButton className="form-submit-btn"  type="submit"> Set/reset Pin </CustomButton>
            </Box>
           </form>
        </CustomModal>
    </Box>
  );
};


export default CardDetail;
