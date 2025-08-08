import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import api from '@/helpers/apiHelper';

const url = import.meta.env.VITE_NODE_ENV === "production" ? "api" : "api";

const FirstSection = () => {
  // Hardcoded test cardId for now
  const cardId = 'abc123-test-card-id';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`${url}/card/${cardId}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Card Transactions Response:", response.data);
      } catch (error) {
        console.error("Error fetching card transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Box>FirstSection</Box>
  );
};

export default FirstSection;
