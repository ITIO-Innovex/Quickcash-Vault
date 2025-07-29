const axios = require('axios');
const { VAULT_BASE_URL } = require('../../Config/VaultConfig');

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
};
