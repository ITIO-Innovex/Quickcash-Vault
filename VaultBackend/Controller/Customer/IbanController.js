const axios = require('axios');
const { VAULT_BASE_URL } = require('../../Config/VaultConfig');
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");

module.exports = {

 createIban : async (req, res) => {
  try {
     const userId = req.user._id;
     const getData = await fetchVaultDetails(userId);
     const vaultToken = getData?.vaultUser?.access_token;

    // Set the required currency as EUR in the request body
    const requestData = {
      currency: 'EUR',  
      ...req.body,      
    };

    // Make POST request to the external API
    const response = await axios.post(`${VAULT_BASE_URL}/bank/v1/bank-accounts`, requestData, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,  // Include Bearer token in the header
      },
    });

    // Send the response from the external API back to the client
    return res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Error creating bank account:', error);
    return res.status(500).json({
      message: 'Error creating bank account',
      error: error.response ? error.response.data : error.message,
    });
  }
},
 getIban : async (req, res) => {
  try {
     const userId = req.user._id;
     const getData = await fetchVaultDetails(userId);
     const vaultToken = getData?.vaultUser?.access_token;

    // Make GET request to the external API
    const response = await axios.get(`${VAULT_BASE_URL}/bank/v1/bank-accounts`, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,  // Include Bearer token in the header
      },
    });

    // Send the response from the external API back to the client
    return res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return res.status(500).json({
      message: 'Error fetching bank accounts',
      error: error.response ? error.response.data : error.message,
    });
  }
},
cancelIbanRequest : async (req, res) => {
  try {
    // Extract the bankAccountId from the request parameters
    const userId = req.user._id;
    const { bankAccountId } = req.params;
     const getData = await fetchVaultDetails(userId);
     const vaultToken = getData?.vaultUser?.access_token;

    // Make POST request to the external API to cancel the bank account
    const response = await axios.post(`${VAULT_BASE_URL}/bank/v1/bank-accounts/${bankAccountId}/cancel`, {
      headers: {
        Authorization: `Bearer ${vaultToken}`, 
      },
    });

    // Send the response from the external API back to the client
    return res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Error cancelling bank account:', error);
    return res.status(500).json({
      message: 'Error cancelling bank account',
      error: error.response ? error.response.data : error.message,
    });
  }
},
}
