const axios = require('axios');
const { VAULT_BASE_URL } = require('../../Config/VaultConfig');
const { fetchVaultDetails } = require('../../Utils/fetchVaultDetails');

module.exports = {
  getCountriesList: async (req, res) => {
    try {
      const userId = req.user._id;

      const getData = await fetchVaultDetails(userId);

      if (!getData || !getData.vaultUser?.access_token) {
        return res.status(401).json({
          status: 401,
          message: "Vault user not found or missing access token",
          data: null,
        });
      }

      const vaultToken = getData.vaultUser.access_token;

      const response = await axios.get(
        `${VAULT_BASE_URL}/reg/v1/catalog/countries`,
        {
          headers: {
            Authorization: `Bearer ${vaultToken}`,
          },
        }
      );

      return res.status(200).json({
        status: 200,
        message: 'Countries fetched successfully',
        data: response.data,
      });

    } catch (error) {
      console.error('❌ Country Fetch Error:', error?.response?.data || error.message);
      return res.status(500).json({
        status: 500,
        message: 'Failed to fetch countries',
        error: error?.response?.data || error.message,
      });
    }
  },
   getStatesList: async (req, res) => {
    try {
      const userId = req.user._id;

      const getData = await fetchVaultDetails(userId);

      if (!getData || !getData.vaultUser?.access_token) {
        return res.status(401).json({
          status: 401,
          message: "Vault user not found or missing access token",
          data: null,
        });
      }

      const vaultToken = getData.vaultUser.access_token;

      const response = await axios.get(
        `${VAULT_BASE_URL}/reg/v1/catalog/countries/states`,
        {
          headers: {
            Authorization: `Bearer ${vaultToken}`,
          },
        }
      );

      return res.status(200).json({
        status: 200,
        message: 'States fetched successfully',
        data: response.data,
      });

    } catch (error) {
      console.error('❌ State Fetch Error:', error?.response?.data || error.message);
      return res.status(500).json({
        status: 500,
        message: 'Failed to fetch states',
        error: error?.response?.data || error.message,
      });
    }
  },
};
