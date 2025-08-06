const axios = require('axios');
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");
const { VAULT_BASE_URL, VAULT_HEADERS } = require('../../Config/VaultConfig');

module.exports = {
  getBlockchainCurrency: async (req, res) => {
    try {
      const response = await axios.get(`${VAULT_BASE_URL}/currency/blockchain`);

      return res.status(200).json({
        status: 200,
        message: 'Blockchain currencies fetched successfully',
        data: response.data,
      });

    } catch (error) {
      console.error('❌ Blockchain Currency Fetch Error:', error?.response?.data || error.message);
      return res.status(500).json({
        status: 500,
        message: 'Failed to fetch blockchain currencies',
        error: error?.response?.data || error.message,
      });
    }
  },
  getTokenData: async (req, res) => {
    try {
      // Hit the external API for token data
      const response = await axios.get(`${VAULT_BASE_URL}/currency/token`);
      
      // Return the response to the client
      return res.status(200).json({
        status: 200,
        message: 'Token data fetched successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching token data:', error);
      return res.status(500).json({
        status: 500,
        message: error.response?.data?.message || 'Error fetching token data',
        data: error.response?.data || null,
      });
    }
  },
  getSummaryToken: async (req, res) => {
    try {
      // Hit the external API for token data
      const response = await axios.get(`${VAULT_BASE_URL}/currency/token/short`);
      
      // Log the response for debugging
      console.log('Token Data Response:', response.data);
      
      // Return the response to the client
      return res.status(200).json({
        status: 200,
        message: 'Token data fetched successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching token data:', error);
      return res.status(500).json({
        status: 500,
        message: error.response?.data?.message || 'Error fetching token data',
        data: error.response?.data || null,
      });
    }
  },
  getPreferredCurrency : async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; 
    const accountId = req.params.accountId; 

    if (!accountId) {
      return res.status(400).json({
        status: 400,
        message: 'Account ID is required',
      });
    }

    // Fetch vault details using the accountId (this can be a separate function to get vault token)
    const vaultToken = await fetchVaultDetails(userId);

    // Make the GET request to the external API using accountId and vaultToken
    const response = await axios.get(`${VAULT_BASE_URL}/currency/preferred/${accountId}`, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,
        ...VAULT_HEADERS(),
      },
    });

    // Log response for debugging
    console.log('External API Response:', response.data);

    // Return the response to the client
    return res.status(200).json({
      status: 200,
      message: 'Preferred currency fetched successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('Error fetching preferred currency:', error);
    return res.status(500).json({
      status: 500,
      message: error.response?.data?.message || 'Error fetching preferred currency',
      data: error.response?.data || null,
    });
  }
  },
  getExchangePairs: async (req, res) => {
    try {
      // Hit the external API for token data
      const response = await axios.get(`${VAULT_BASE_URL}/currency/exchange_pair`);
      
      // Log the response for debugging
      console.log('Token Data Response:', response.data);
      
      // Return the response to the client
      return res.status(200).json({
        status: 200,
        message: 'Token data fetched successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching token data:', error);
      return res.status(500).json({
        status: 500,
        message: error.response?.data?.message || 'Error fetching token data',
        data: error.response?.data || null,
      });
    }
  },
  getExchangeRate : async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.query;

    // Validate query parameters
    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        status: 400,
        message: 'fromCurrency, toCurrency, and amount are required query parameters',
      });
    }

    // Call the external API with query parameters
    const response = await axios.get(`${VAULT_BASE_URL}/currency/rate`, {
      params: {
        fromCurrency,
        toCurrency,
        amount
      }
    });

    // Send the response from the external API back to the client
    return res.status(200).json({
      status: 200,
      message: 'Exchange rate fetched successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return res.status(500).json({
      status: 500,
      message: error.response?.data?.message || 'Error fetching exchange rate',
      data: error.response?.data || null,
    });
  }
  },
  getAllInstruments: async (req, res) => {
    try {
      // Hit the external API for token data
      const response = await axios.get(`${VAULT_BASE_URL}/currency/instruments/`);
      
      // Log the response for debugging
      console.log('Token Data Response:', response.data);
      
      // Return the response to the client
      return res.status(200).json({
        status: 200,
        message: 'Token data fetched successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching token data:', error);
      return res.status(500).json({
        status: 500,
        message: error.response?.data?.message || 'Error fetching token data',
        data: error.response?.data || null,
      });
    }
  },
  getInstrumentDetails : async (req, res) => {
  try {
    // Extract the instrument path parameter from the request
    const { instrument } = req.params;
    
    // Check if the instrument is provided
    if (!instrument) {
      return res.status(400).json({
        status: 400,
        message: 'Instrument parameter is required',
      });
    }

    // Call the external API to fetch instrument data using the instrument parameter
    const response = await axios.get(`${VAULT_BASE_URL}/currency/instruments/${instrument}`);

    // Return the response from the external API
    return res.status(200).json({
      status: 200,
      message: 'Instrument data fetched successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('Error fetching instrument details:', error);
    return res.status(500).json({
      status: 500,
      message: error.response?.data?.message || 'Error fetching instrument data',
      data: error.response?.data || null,
    });
  }
  },
};
