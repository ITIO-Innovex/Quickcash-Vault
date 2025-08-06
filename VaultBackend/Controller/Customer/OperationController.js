const axios = require('axios');
const { VAULT_BASE_URL } = require('../../Config/VaultConfig');
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");

module.exports = {

handlePayinRequest : async (req, res) => {

  const userId = req.user._id;
  const { account,  fromCurrency , toCurrency, fromAmount } = req.body;

  try {
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;
    // Make API call to /wallet/payin with the required params
    const response = await axios.post(
    `${VAULT_BASE_URL}/wallet/payin`,
      { account, fromCurrency, toCurrency, fromAmount },
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
        },
      }
    );

    // Send back the response from the API
    return res.status(200).json({
      status: 200,
      message: 'Payin request successful',
      data: response.data,
    });

  } catch (error) {
    console.error('Error handling payin request:', error);
    return res.status(500).json({
      status: 500,
      message: error.message || 'Error processing the payin request',
    });
  }
},
getAllPayin : async (req, res) => {
  try {
     const userId = req.user._id;
     const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    // Making the GET request to the external API
    const response = await axios.get(`${VAULT_BASE_URL}/wallet/payin`, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,
      },
    });

    // Send the response from the external API back to the client
    return res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Error fetching payin data:', error);
    return res.status(500).json({
      message: 'Error fetching payin data',
      error: error.response ? error.response.data : error.message,
    });
  }
},
payinById : async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;  // Extract the id from URL params
    
    if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

     const getData = await fetchVaultDetails(userId);
     const vaultToken = getData?.vaultUser?.access_token;

    // Make the GET request to the external API using the id
    const response = await axios.get(`${VAULT_BASE_URL}/wallet/v1/payin/${id}`, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,
      },
    });

    // Send the response from the external API back to the client
    return res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Error fetching payin data by ID:', error);
    return res.status(500).json({
      message: 'Error fetching payin data by ID',
      error: error.response ? error.response.data : error.message,
    });
  }
},
handleWithdrawal : async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, currency, amount, fromAccount, iban, bicOrSwiftCode, to, blockchain } = req.body;
    
    // Check if the required fields are present
    if (!currency || !amount || !type || !fromAccount) {
      return res.status(400).json({ status: 'BAD_REQUEST', message: 'Missing required fields' });
    }

    // Prepare the body for the API request based on the type of withdrawal
    let requestBody = {
      currency,
      amount,
      type,
      fromAccount
    };

    // Add specific fields depending on withdrawal type
    if (type === 'BANK_TRANSFER') {
      if (!iban || !bicOrSwiftCode) {
        return res.status(400).json({ status: 'BAD_REQUEST', message: 'IBAN and BIC/Swift code are required for BANK_TRANSFER' });
      }
      requestBody = { ...requestBody, iban, bicOrSwiftCode };
    } else if (type === 'CRYPTO') {
      if (!to || !blockchain) {
        return res.status(400).json({ status: 'BAD_REQUEST', message: 'Address and blockchain are required for CRYPTO withdrawal' });
      }
      requestBody = { ...requestBody, to, blockchain };
    } else {
      return res.status(400).json({ status: 'BAD_REQUEST', message: 'Invalid withdrawal type' });
    }
     const getData = await fetchVaultDetails(userId);
     const vaultToken = getData?.vaultUser?.access_token;

    const response = await axios.post(`${VAULT_BASE_URL}/wallet/withdraw`, requestBody, {
      headers: {
        Authorization: `Bearer ${vaultToken}`
      }
    });

    // Send back the response from the external API
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in withdrawal request:', error);
    return res.status(500).json({
      status: 'SERVER_ERROR',
      message: 'An error occurred while processing the withdrawal request',
      error: error.message
    });
  }
},
}