import api from '@/helpers/apiHelper';         
import { useEffect, useState } from 'react';
import { useAppToast } from '@/utils/Toast';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/system';
import { shouldForwardProp } from '@mui/system';
import AddCardIcon from '@mui/icons-material/AddCard'; 
import  CommonTooltip from'@/components/common/toolTip';
import { Box, Grid, Card, CardContent, CardHeader, Typography, CircularProgress, Grow, IconButton,} from '@mui/material';
const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

// Gradients
const gradients = {
  GOLD: "linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)",
  ORANGE: "linear-gradient(90deg, #FC6434 0%, #FDBB2D 100%)",
};

const slideSheen = keyframes`
  0% {
    left: -40%;
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  70% {
    left: 80%;
    opacity: 0.5;
  }
  100% {
    left: 130%;
    opacity: 0;
  }
`;

interface CardWrapperProps {
  colorKey: keyof typeof gradients | string;
}

// CardWrapper:
const CardWrapper = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'colorKey'
})<CardWrapperProps>(({ colorKey }) => ({
  background: gradients[colorKey] || gradients.ORANGE,
  borderRadius: 18,
  boxShadow: '0 3px 18px -4px #ddd',
  height: "100%",
  color: colorKey === "GOLD" ? "#79520A" : "#B24500",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}));

const Sheen = styled('div')`
  position: absolute;
  top: 0;
  left: -40%;
  width: 60%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.15) 100%);
  filter: blur(2px);
  pointer-events: none;
  animation: ${slideSheen} 2.1s cubic-bezier(0.4,0,0.2,1) 0.15s both infinite;
`;

const apiCache = { offers: null }; // Yeh file ke bahar rakh lo (static, puri session ke liye)

const CardOffers = () => {
    const toast = useAppToast();
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(null);

  useEffect(() => {
    if (apiCache.offers) {
      setOffers(apiCache.offers);
      return;
    }

    const fetchCardOffers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`${url}/card/offers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // console.log("Card Offers Response:", response);
        if (response.status === 200) {
          const arr = Array.isArray(response.data) ? response.data : response.data?.data || [];
          setOffers(arr);
          apiCache.offers = arr; 
        }
      } catch (err) {
        console.error("Error fetching card offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardOffers();
  }, []);

   const handleCreateCardRequest = async (offer, design) => {
    setCreateLoading(design.id);
    try {
      const token = localStorage.getItem("token");
      // Validate/guard (normally design & offer IDs always valid)
      if (!offer.id || !design.id) {
        toast.error("Missing offer or design information.");
        setCreateLoading(null);
        return;
      }
      const payload = {
        cardOfferId: offer.id,
        cardDesignId: design.id,
        reapDisclaimerAccepted: true,
      };
      const resp = await api.post(`${url}/card/create`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.status === 200 || resp.status === 201) {
        toast.success("Request created successfully! ");
         setTimeout(() => {
        navigate("/card-requests");
      }, 600);
      } else {
        toast.error(resp.data?.message || "Something went wrong!");
      }
    } catch (error) {
     let errorMsg = "";
        if (error.response?.data?.message) {
        errorMsg = "Error: " + error.response.data.message + " OR Please cancel the request and try again.";
        } else if (error.message) {
        errorMsg = "Error: " + error.message + " OR Please cancel the request and try again.";
        } else {
        errorMsg = "Unknown error OR Please cancel the request and try again.";
        }
        toast.error(errorMsg);

      console.error("Error creating card request:", error);
    } finally {
      setCreateLoading(null);
    }
  };


  return (
    <Box sx={{ minHeight: "300px", width: "100%" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        align="center"
        letterSpacing={1}
        sx={{
          mb: { xs: 2, md: 2 },
          mt: { xs: 2, md: 4 },
          color: "text.primary",
        }}
      >
        Available Cards for you
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
          <Grid container spacing={3}>
            {offers.length === 0 && (
              <Grid item xs={12}>
                <Typography align="center" color="text.secondary">
                  No offers found.
                </Typography>
              </Grid>
            )}
            {offers.map((offer) =>
              (offer.allowedCardDesigns || []).map((design) => {
                const colorKey = design?.color?.name?.toUpperCase() || "ORANGE";
                const isLoading = createLoading === design.id;
                return (
                  <Grow in timeout={700} key={design.id}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <CardWrapper colorKey={colorKey}>
                        <Sheen />
                        <CardHeader
                          title={design.color?.name || "CARD"}
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: 2,
                            fontWeight: 700,
                            color: colorKey === "GOLD" ? "#79520A" : "#B24500",
                            bgcolor: "transparent",
                            pb: 1,
                          }}
                          // 📌 IconButton (endAction pe)
                          action={
                            <CommonTooltip title="Create card request">
                              <span>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleCreateCardRequest(offer, design)}
                                  disabled={isLoading}
                                  size="large"
                                >
                                  {isLoading
                                    ? <CircularProgress size={24} color="inherit" />
                                    : <AddCardIcon fontSize="large" />}
                                </IconButton>
                              </span>
                            </CommonTooltip>
                          }
                        />
                        <CardContent sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {design.name?.replace(/_/g, ' ') || "Offer Name"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mt: 1, fontWeight: 500, color: "#2D2D2D" }}
                          >
                            Card Type: {offer.cardType}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: "#2D2D2D" }}
                          >
                            Price: {offer.currentPriceAmount} {offer.currentPriceCurrency}
                          </Typography>
                        </CardContent>
                      </CardWrapper>
                    </Grid>
                  </Grow>
                );
              })
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};
export default CardOffers;
