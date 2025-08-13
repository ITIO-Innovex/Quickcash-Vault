const axios = require('axios');
const { VAULT_BASE_URL } = require('../../Config/VaultConfig');
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");

module.exports = {

fetchCardOffers : async (req, res) => {
    try {
        const userId = req.user._id;
        const getData = await fetchVaultDetails(userId);    
        const vaultToken = getData?.vaultUser?.access_token;

        // Call the external API to fetch card offers
        const response = await axios.get(`${VAULT_BASE_URL}/card-holder/v1/card-offers`, {
        headers: {
            Authorization: `Bearer ${vaultToken}`,
        },
        });

    // Return the response from the external API
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      // Error response from the external API
      console.error('API Error Response:', error.response.data); 
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || []
      });
    } else {
      // If there is an error other than the API response error
      console.error('Error fetching card offers:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while fetching card offers',
        error: error.message
      });
    }
  }
},
getCardRequests : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // Call the external API to fetch card requests
    const response = await axios.get(
      `${VAULT_BASE_URL}/card-holder/v1/card-requests`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    // Return the actual API response
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      // External API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Any other error
      console.error('Error fetching card requests:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while fetching card requests',
        error: error.message,
      });
    }
  }
},
createCardRequest : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // Extract required fields from request body
    const { cardOfferId, cardDesignId, reapDisclaimerAccepted } = req.body;

    // Basic validation (if missing params)
    if (!cardOfferId || !cardDesignId || typeof reapDisclaimerAccepted !== "boolean") {
      return res.status(400).json({
        status: 400,
        message: "cardOfferId, cardDesignId, and reapDisclaimerAccepted are required (and reapDisclaimerAccepted must be boolean)",
      });
    }

    // Make POST request to external API
    const response = await axios.post(
      `${VAULT_BASE_URL}/card-holder/v2/card-requests`,
      {
        cardOfferId,
        cardDesignId,
        reapDisclaimerAccepted
      },
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      // External API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      console.error('Error posting card request:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while posting card request',
        error: error.message,
      });
    }
  }
},
deleteCardRequest : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // cardRequestId from path params
    const { cardRequestId } = req.params;

    if (!cardRequestId) {
      return res.status(400).json({
        status: 400,
        message: "cardRequestId is required in path params.",
      });
    }

    // Make DELETE call to the external API
    const response = await axios.delete(
      `${VAULT_BASE_URL}/card-holder/v1/card-requests/${cardRequestId}`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      // API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Other error
      console.error('Error deleting card request:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while deleting card request',
        error: error.message,
      });
    }
  }
},
setCardholderName : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // cardholderName from body
    const { cardholderName, cardRequestId } = req.body;

    // Validate input
    if (!cardRequestId || !cardholderName) {
      return res.status(400).json({
        status: 400,
        message: "cardRequestId (in path) and cardholderName (in body) are required."
      });
    }

    // API call
    const response = await axios.post(
      `https://platform-api.sandbox.testessential.net/card-holder/v1/card-requests/${cardRequestId}/cardholder-name`,
      { cardholderName },
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      // External API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Other error
      console.error('Error posting cardholder name:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while posting cardholder name',
        error: error.message,
      });
    }
  }
},
setCardAddress : async (req, res) => {

  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // Path param
    const { cardRequestId } = req.params;
    // Body
    const { billing, delivery } = req.body;

    // Basic validation
    if (!cardRequestId) {
      return res.status(400).json({ status: 400, message: "cardRequestId (in path) is required." });
    }
    if (!billing) {
      return res.status(400).json({ status: 400, message: "billing address object is required in body." });
    }
    // Validate billing address object
    const billingRequired = ['country','city','addressLine1','addressLine2'];
    const missingBillingFields = billingRequired.filter(f => !billing[f]);
    if (missingBillingFields.length > 0) {
      return res.status(400).json({ status: 400, message: `Missing billing fields: ${missingBillingFields.join(', ')}` });
    }

    // If delivery is present, validate its required fields (for physical cards)
    if (delivery) {
      const deliveryRequired = [
        'country','city','addressLine1','postalCode','firstName','lastName','phone','dialCode'
      ];
      const missingDeliveryFields = deliveryRequired.filter(f => !delivery[f]);
      if (missingDeliveryFields.length > 0) {
        return res.status(400).json({ status: 400, message: `Missing delivery fields: ${missingDeliveryFields.join(', ')}` });
      }
    }

    // Make POST request to external API
    const response = await axios.post(
      `${VAULT_BASE_URL}/card-holder/v1/card-requests/${cardRequestId}/address`,
      { billing, ...(delivery && { delivery }) },
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      // API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Other error
      console.error('Error posting card address:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while posting card address',
          error: error.response ? error.response.data : error.message,
      });
    }
  }
},
getPlasticDeliveryCountries : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    const response = await axios.get(
      `${VAULT_BASE_URL}/card-holder/v1/card-requests/country/plastic-delivery`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Other error
      console.error('Error fetching plastic delivery countries:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while fetching plastic delivery countries',
        error: error.message,
      });
    }
  }
},
getCardTransactions : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;
    // Path param
    const { cardId } = req.params;
    
    const response = await axios.get(
      `${VAULT_BASE_URL}/wallet/v1/card/${cardId}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    // Return external API response as-is
    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      console.error('Error fetching card transactions:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while fetching card transactions',
        error: error.message,
      });
    }
  }
},
getCardList : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    const response = await axios.get(
      `${VAULT_BASE_URL}/card-holder/v1/cards`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Server level error
      console.error('Error fetching cards:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while fetching cards',
        error: error.message,
      });
    }
  }
},
changeCardStatus: async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;
    console.log("VaultToken from change pin route", vaultToken);

    const { cardId } = req.params;
    const { requiredStatus } = req.query;  // Fetch from query parameters instead of body
    console.log(`Data from change pin route, ${cardId} & ${requiredStatus}`);

    // Input validation
    if (!cardId) {
      return res.status(400).json({
        status: 400,
        message: "cardId is required in path params."
      });
    }

    if (!requiredStatus) {
      return res.status(400).json({
        status: 400,
        message: "RequiredStatus is required."
      });
    }

    const response = await axios.post(
      `${VAULT_BASE_URL}/card-holder/cardholder/card/${cardId}/change-status`,
      {},  // No need to pass requiredStatus in the body, it's in query
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
        params: { requiredStatus }  // Pass requiredStatus as a query parameter
      }
    );

    // Log the response from Vault API
    console.log('Vault API Response:', response.data);

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      // API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Server error
      console.error('Error changing card status:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while changing card status',
        error: error.message,
      });
    }
  }
},
activateCard : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // Path params
    const { cardId } = req.params;
    // Body params
    const { activationCode } = req.body;

    // Input validation
    if (!cardId) {
      return res.status(400).json({
        status: 400,
        message: "cardId is required in path params."
      });
    }
    if (!activationCode) {
      return res.status(400).json({
        status: 400,
        message: "activationCode is required in body."
      });
    }

    const response = await axios.post(
      `${VAULT_BASE_URL}/card-holder/cardholder/card/${cardId}/activate`,
      { activationCode },
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      // External API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Other error
      console.error('Error activating card:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while activating card',
        error: error.message,
      });
    }
  }
},
getCardDetails : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // cardId from req.body
    const { cardId } = req.params;

    if (!cardId) {
      return res.status(400).json({
        status: 400,
        message: "cardId is required in request body.",
      });
    }

    // Axios GET call (cardId ko path mein lagao)
    const response = await axios.get(
      `${VAULT_BASE_URL}/card-holder/cardholder/card/${cardId}`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    // Success response
    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      // API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Other error
      console.error('Error fetching card details:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while fetching card details',
        error: error.message,
      });
    }
  }
},
updateCardPin : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // cardId from path param
    const { cardId } = req.params;
    // Required fields
    const { secretQuestion, secretQuestionAnswer, pin } = req.body;

    if (!cardId) {
      return res.status(400).json({
        status: 400,
        message: "cardId is required in path params."
      });
    }
    if (!pin) {
      return res.status(400).json({
        status: 400,
        message: "pin is required in request body."
      });
    }

    // Prepare body as per possible API requirements
    const requestBody = { pin };
    if (secretQuestion) requestBody.secretQuestion = secretQuestion;
    if (secretQuestionAnswer) requestBody.secretQuestionAnswer = secretQuestionAnswer;

    // Axios PUT call
    const response = await axios.put(
      `${VAULT_BASE_URL}/card-holder/v1/cards/${cardId}/pin`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      console.error('Error updating card PIN:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while updating card PIN',
        error: error.message,
      });
    }
  }
},
getCardSensitiveDetails : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // Path param se cardId lo
    const { cardId } = req.params;

    if (!cardId) {
      return res.status(400).json({
        status: 400,
        message: "cardId is required in path params.",
      });
    }

    // API call
    const response = await axios.get(
      `${VAULT_BASE_URL}/card-holder/cardholder/card/${cardId}/sensitive-details`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    // Success response
    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      // API error
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      // Other error
      console.error('Error fetching card sensitive details:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while fetching card sensitive details',
        error: error.message,
      });
    }
  }
},
getCardFullDetails : async (req, res) => {
  try {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // Path param se cardId lo
    const { cardId } = req.params;
    if (!cardId) {
      return res.status(400).json({
        status: 400,
        message: "cardId is required in path params.",
      });
    }

    // Axios GET request
    const response = await axios.get(
      `${VAULT_BASE_URL}/card-holder/cardholder/card/${cardId}/details`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      return res.status(error.response.status).json({
        status: error.response.status,
        message: error.response.data.message,
        traceId: error.response.data.traceId,
        errors: error.response.data.errors || [],
      });
    } else {
      console.error('Error fetching card full details:', error.message);
      return res.status(500).json({
        status: 'SERVER_ERROR',
        message: 'An error occurred while fetching card full details',
        error: error.message,
      });
    }
  }
},
}
