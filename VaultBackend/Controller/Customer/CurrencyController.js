const axios = require('axios');
const { VAULT_BASE_URL } = require('../../Config/VaultConfig');

module.exports = {
  getCurrencyList: async (req, res) => {
      try {
      // Hit the external API
      const response = await axios.get(`${VAULT_BASE_URL}/currency/currency`);
      
      // Return the response to the client
      return res.status(200).json({
        status: 200,
        message: 'Currency data fetched successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching currency data:', error);
      return res.status(500).json({
        status: 500,
        message: error.response?.data?.message || 'Error fetching currency data',
        data: error.response?.data || null,
      });
    }
  },
  getCurrencyBySlug: async (req, res) => {
    try {
      // Extract slug from the request body
      const { slug } = req.body;
      
      if (!slug) {
        return res.status(400).json({
          status: 400,
          message: "Slug is required",
        });
      }
      const response = await axios.get(`${VAULT_BASE_URL}/currency/currency/slug/${slug}`);

      // Return the response to the client
      return res.status(200).json({
        status: 200,
        message: 'Currency data fetched successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching currency by slug:', error);
      return res.status(500).json({
        status: 500,
        message: error.response?.data?.message || 'Error fetching currency data',
        data: error.response?.data || null,
      });
    }
  },
   getCurrencyShortList: async (req, res) => {
    try {
      // Hit the external API without any parameters
      const response = await axios.get(`${VAULT_BASE_URL}/currency/currency/short`);

      // Return the response to the client
      return res.status(200).json({
        status: 200,
        message: 'Currency short list fetched successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching currency short list:', error);
      return res.status(500).json({
        status: 500,
        message: error.response?.data?.message || 'Error fetching currency short list',
        data: error.response?.data || null,
      });
    }
  },
  getCurrencyByName: async (req, res) => {
    try {
      // Extract 'name' from the request body
      const { name } = req.body;

      // Check if the 'name' is provided
      if (!name) {
        return res.status(400).json({
          status: 400,
          message: "Currency name is required",
        });
      }
      // Hit the external API with the name in the URL
      const response = await axios.get(`${VAULT_BASE_URL}/currency/currency/name/${name}`);

      // Return the response to the client
      return res.status(200).json({
        status: 200,
        message: 'Currency data fetched by name successfully',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching currency by name:', error);
      return res.status(500).json({
        status: 500,
        message: error.response?.data?.message || 'Error fetching currency data by name',
        data: error.response?.data || null,
      });
    }
  },
  getCurrencyInstruments : async (req, res) => { 
  try {
    const response = await axios.get(`${VAULT_BASE_URL}/currency/instruments/`);
    // Success response
    res.status(200).json({
      success: true,
      data: response.data,
      message: 'Currency instruments fetched successfully!'
    });
  } catch (error) {
    // Error handling
    res.status(error.response?.status || 500).json({
      success: false,
      data: null,
      message: error.message || 'Failed to fetch currency instruments',
      details: error.response?.data || null
    });
  }
  },
};