import axios from "axios";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "@/components/CustomButton";
import { Card, CardContent,Typography,Grid, Chip,useTheme, CardActions, Slide, Box,} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Plan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  initialPaymentAmount: number;
  subscriptionInterval: string;
  trialAvailable: boolean;
  level: number;
  mostPopular: boolean;
}

const PlansList = () => {
  const theme = useTheme();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscribedPlanId, setSubscribedPlanId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token not found in localStorage");
        return;
      }

      const response = await axios.get(`${API_URL}/subscription/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPlans(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching subscriptions:", error?.response?.data || error.message);
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token missing");
        return;
      }

      const response = await axios.post(
        `${API_URL}/subscription/start`,
        {
          anyCurrency: true,
          subscriptionDetailsId: plan.id,
          fullPlanDetails: plan, // If backend expects entire object
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Subscription started:", response.data);
      navigate("/my-plans");
      // const payUrl = response.data?.data?.payUrl;
      // if (payUrl) {
      //   window.location.href = payUrl;
      // }
      // }
    } catch (error) {
      console.error("❌ Subscription failed:", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);


 return (
    <Box className="p-4">
      <Typography variant="h5" gutterBottom>
        Available Subscription Plans
      </Typography>
      <Grid container spacing={3}>
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Slide in direction="up" timeout={400 + index * 200}>
              <Card
                elevation={plan.mostPopular ? 6 : 3}
                className="rounded-2xl hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {plan.name}
                    </Typography>
                    {plan.mostPopular && (
                      <Chip
                        icon={<Star size={18} />}
                        label="Most Popular"
                        size="small"
                        sx={{
                          backgroundColor: "#483594",
                          color: "#ccc",
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" mb={1}>
                    {plan.description}
                  </Typography>

                  <Typography variant="h4" color="primary" mb={1}>
                    ${plan.amount}
                    <Typography variant="caption" color="text.gray" ml={1}>
                      / {plan.subscriptionInterval.replace("DAYS", "")} days
                    </Typography>
                  </Typography>

                  <Typography variant="body2" color="text.primary" mb={1}>
                    Initial Payment: ${plan.initialPaymentAmount}
                  </Typography>

                  <Typography variant="body2" color="text.primary" mb={1}>
                    Level: {plan.level}
                  </Typography>

                  <Typography variant="body2" color="text.primary" mb={1}>
                    Currency: {plan.currency}
                  </Typography>

                  {plan.trialAvailable && (
                    <Chip
                      label="Free Trial Available"
                      size="small"
                      sx={{
                        backgroundColor: "#483594",
                        color: "#fff",
                        fontWeight: 500,
                        mt: 1,
                      }}
                    />
                  )}
                </CardContent>

                <CardActions className="p-3">
                 <CustomButton
  fullWidth
  onClick={() => handleSubscribe(plan)} // 🔥 important
  sx={{
    backgroundColor: "#483594",
    "&:hover": {
      backgroundColor: "#3a296f",
    },
  }}
>
  Subscribe
</CustomButton>

                </CardActions>
              </Card>
            </Slide>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default PlansList;
