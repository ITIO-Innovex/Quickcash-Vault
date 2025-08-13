import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardOffer from './card-details/cardOffer';
import CardDetail from './card-details/cardDetail';
import { Box, Grid, useTheme } from '@mui/material';
import PageHeader from '@/components/common/pageHeader';
import api from '@/helpers/apiHelper';
const url = import.meta.env.VITE_NODE_ENV === 'production' ? 'api' : 'api';

const Cards: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Fetch cards data dynamically
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
        const res = await api.get(`${url}/card/all`, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data;
        // console.log(data);
        setCards(data); 
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    };

    fetchCards();
  }, []);

  const currentCard = cards[currentCardIndex];

  return (
    <Box className="dashboard-container cards-root" >
      <PageHeader title="Cards" />

      <Grid  container  spacing={3}  justifyContent="center" alignItems="stretch">
        {/* LEFT BOX */}
        <Grid item xs={12} md={12} lg={6} >
          <Box >
            <CardDetail  cards={cards}
              setCards={setCards}
              current={currentCardIndex}
              setCurrent={setCurrentCardIndex}/>
          </Box>
        </Grid>

        {/* RIGHT BOX */}
        <Grid item xs={12} md={12} lg={6} >
          <Box >
           <CardOffer cardId={currentCard?.id} card={currentCard}  />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cards;
