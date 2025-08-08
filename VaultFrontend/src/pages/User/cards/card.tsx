import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardOffer from './card-details/cardOffer';
import CardDetail, { dummyCards } from './card-details/cardDetail';
import { Box, Grid, useTheme } from '@mui/material';
import PageHeader from '@/components/common/pageHeader';

const Cards: React.FC = () => {
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const currentCard = dummyCards[currentCardIndex];

  return (
    <Box className="dashboard-container cards-root" maxWidth="xl">
      <PageHeader title="Cards" />

      <Grid 
        container 
        spacing={3} 
        justifyContent="center"
        alignItems="stretch"
        className="cards-grid"
      >
        {/* LEFT BOX */}
        <Grid item xs={12} md={6} lg={6} className="cards-grid-item left-pane">
          <Box className="cards-paper left-pane-paper">
            <CardDetail  cards={dummyCards}
              current={currentCardIndex}
              setCurrent={setCurrentCardIndex}/>
          </Box>
        </Grid>

        {/* RIGHT BOX */}
        <Grid item xs={12} md={6} lg={6} className="cards-grid-item right-pane">
          <Box className="cards-paper right-pane-paper">
           <CardOffer cardId={currentCard?.id} card={currentCard}  />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cards;
