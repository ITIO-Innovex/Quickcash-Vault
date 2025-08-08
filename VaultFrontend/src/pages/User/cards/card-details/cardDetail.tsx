import axios from 'axios';
import api from '@/helpers/apiHelper';
import { useEffect, useState } from 'react';
import { useAppToast } from '@/utils/Toast';
import { Box, FormControl } from '@mui/material';
import CustomModal from '@/components/CustomModal';
import CustomInput from '@/components/CustomInputField';
import CustomSelect from '@/components/CustomDropdown';
import CustomButton from '@/components/CustomButton';

const url = import.meta.env.VITE_NODE_ENV === 'production' ? 'api' : 'api';

export const dummyCards = [
  {
    id:'001',
    name: "Visa Card",
    number: "**** **** **** 1234",
    expiry: "12/28",
    type: "Visa",
    color: "#845ec2",
    country: "IN",
  },
  {
    id:'002',
    name: "MasterCard",
    number: "**** **** **** 8765",
    expiry: "08/27",
    type: "MasterCard",
    color: "#2c73d2",
    country: "IN",
  }
];


const CardDetail = ({cards, current, setCurrent}) => {
  const toast = useAppToast();
  const [pin, setPin] = useState('');
  const [cardId, setCardId] = useState('');
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [secretQuestion, setSecretQuestion] = useState('');
  const [requiredStatus, setRequiredStatus] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [secretQuestionAnswer, setSecretQuestionAnswer] = useState('');
  const next = () => setCurrent(prev => (prev + 1) % dummyCards.length);
  const prev = () => setCurrent(prev => (prev - 1 + dummyCards.length) % dummyCards.length);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
        const res = await api.get(`/${url}/card/all`, {
        });
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchCards();
  }, []);

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
  {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status changed successfully!");
      console.log("Change Status API response:", res.data);
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
  console.log({ cardId: cardId, secretQuestion, secretQuestionAnswer, pin });
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
    console.log("Set/Reset PIN API response:", res.data.data);
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
        toast.success("Card details fetched. See console.");
        console.log('Get Card Details API Response:', res.data);
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

    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `${url}/card/${cardId}/sensitive-details `, { headers: { Authorization: `Bearer ${token}` } }
      );
      if(res.status ==  200){
        toast.success(" details fetched. See console.");
        console.log('Get Sensitive Details API Response:', res.data);
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
    }
  };

  return (
    <Box className="slider-outer">
      <Box className="slider-controls">
        <button className="slider-arrow" onClick={prev}>&lt;</button>

        <Box className="card-visual"style={{ background: `linear-gradient(110deg, ${dummyCards[current].color}, #1d1d39 85%)`,}}>
          <Box className="card-header">
            <Box className="card-avatar">
              {dummyCards[current].type === "Visa" ? "V" : "M"}
            </Box>
            <img
              alt="country"
              src={`https://flagcdn.com/24x18/${dummyCards[current].country.toLowerCase()}.png`}
              className="card-flag"
            />
          </Box>
         <Box className="card-number">{dummyCards[current].number}</Box>
          <Box className="card-name">{dummyCards[current].name}</Box>
          <Box className="card-name">
            <span>Valid Thru</span>
            {dummyCards[current].expiry}
          </Box>
        </Box>
        <button className="slider-arrow" onClick={next}>&gt;</button>
      </Box>
      <Box className="slider-dots">
        {dummyCards.map((_, idx) => (
          <Box
            key={idx}
            className={`slider-dot${current === idx ? ' active' : ''}`}
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
          
        <CustomInput className="form-input" type="text" value={secretQuestionAnswer} onChange={e => setSecretQuestionAnswer(e.target.value)} label="Secret Question's Answer"/>

        <CustomInput className="form-input" type="password" value={pin} onChange={e => setPin(e.target.value)} label="PIN" required/>
           <Box display="flex" justifyContent="flex-end" mt={2}>
              <CustomButton className="form-submit-btn"  type="submit"> Set/reset Pin </CustomButton>
            </Box>
           </form>
        </CustomModal>
    </Box>
  );
};


export default CardDetail;
