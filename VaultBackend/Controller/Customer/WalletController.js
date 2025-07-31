const express = require("express");
const axios = require("axios");
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");
const SubscriptionPlan = require('../../Models/Customer/subscriptionPlanModel');
const { VAULT_HEADERS,VAULT_WALLET_URL,VAULT_BASE_URL  } = require("../../Config/VaultConfig");
const Wallet = require('../../Models/Customer/WalletModel');

module.exports = {
getWalletAccount: async (req, res) => {
  const userId = req.user._id || req.user.id;

  try {
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    if (!vaultToken) {
      return res.status(401).json({
        status: 401,
        message: "Vault access token not found",
        data: null,
      });
    }

    console.log("✅ Vault Token Found, fetching wallet account for user:", userId);

    const response = await axios.get(
        `${VAULT_WALLET_URL}/account`, {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          ...VAULT_HEADERS(),
        },
      }
    );

    console.log("🎯 Wallet Data:", response.data);

    return res.status(200).json({
      status: 200,
      message: "Wallet account data fetched successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ Wallet Account Error:", error?.response?.data || error.message);
    return res.status(error?.response?.status || 500).json({
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message || "Vault API error or server issue.",
      data: error?.response?.data || null,
    });
  }
},
getWalletAccountById: async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { accountId } = req.params;

  if (!accountId) {
    return res.status(400).json({
      status: 400,
      message: "Missing required path parameter: accountId",
      data: null,
    });
  }

  try {
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    if (!vaultToken) {
      return res.status(401).json({
        status: 401,
        message: "Vault access token not found",
        data: null,
      });
    }

    console.log("✅ Vault Token Found, fetching account:", accountId);

    const response = await axios.get(
      `${VAULT_WALLET_URL}/account/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          ...VAULT_HEADERS(),
        },
      }
    );

    return res.status(200).json({
      status: 200,
      message: "Wallet account details fetched successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ Wallet Account Fetch Error:", error?.response?.data || error.message);
    return res.status(error?.response?.status || 500).json({
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Vault API error or server issue.",
      data: error?.response?.data || null,
    });
  }
},
getWalletAddress: async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { accountId, blockchain } = req.query;

  // Check for required params
  if (!accountId || !blockchain) {
    return res.status(400).json({
      status: 400,
      message: 'accountId and blockchain are required',
      data: null,
    });
  }

  try {
    // Fetch vault details
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    if (!vaultToken) {
      return res.status(401).json({
        status: 401,
        message: "Vault access token not found",
        data: null,
      });
    }

    const response = await axios.get(`${VAULT_BASE_URL}/wallet/v2/address/`, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,
        ...VAULT_HEADERS(),
      },
      params: {
        accountId,
        blockchain,
      },
    });

    // Check if the wallet already exists in DB
    const existingWallet = await Wallet.findOne({ userId, accountId });

    if (existingWallet) {
      return res.status(200).json({
        status: 200,
        message: "Wallet address already exists for this user and account.",
        data: existingWallet,
      });
    }

    // Save wallet address to DB if not exists
    const walletData = response.data;

    const newWallet = new Wallet({
      userId,
      accountId: walletData.accountId,
      addressIndex: walletData.addressIndex,
      blockchain: walletData.blockchain,
      address: walletData.address,
      type: walletData.type,
    });

    await newWallet.save();  // Save wallet data to DB

    return res.status(200).json({
      status: 200,
      message: "Wallet address fetched and saved successfully",
      data: newWallet,
    });

  } catch (error) {
    console.error("❌ Wallet Address Fetch Error:", error?.response?.data || error.message);
    return res.status(error?.response?.status || 500).json({
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Vault API error or server issue. Please check your subscription benefits.",
      data: error?.response?.data || null,
    });
  }
},
 topUpWallet: async (req, res) => {
    const userId = req.user._id || req.user.id;
    const { walletAddress, blockchain } = req.body; // wallet address and blockchain info from request body

    // Check for required parameters
    if (!walletAddress || !blockchain) {
      return res.status(400).json({
        status: 400,
        message: 'Wallet address and blockchain are required',
        data: null,
      });
    }

    try {
      // Fetch Vault details (for token authentication)
      const getData = await fetchVaultDetails(userId);
      const vaultToken = getData?.vaultUser?.access_token;

      if (!vaultToken) {
        return res.status(401).json({
          status: 401,
          message: "Vault access token not found",
          data: null,
        });
      }

      // API call to the faucet to request testnet tokens (Example for Sepolia faucet)
      const response = await axios.post('https://sepoliafaucet.com/api/sendETH', {
        address: walletAddress,
      });

      // If status code is 200, it means success
      if (response.status === 200) {
        console.log('✅ Tokens successfully sent to wallet!');
        return res.status(200).json({
          status: 200,
          message: 'Tokens successfully sent!',
          data: response.data, // Faucet response data (confirmation or additional info)
        });
      } else {
        // If status code is not 200, print the status and message
        return res.status(response.status).json({
          status: response.status,
          message: response.data?.message || 'Error while processing the faucet request.',
          data: response.data || null,
        });
      }

    } catch (error) {
      // Handle errors
      console.error('❌ Error during API call:', error.message);
      return res.status(error?.response?.status || 500).json({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || 'Internal server error.',
        data: error?.response?.data || null,
      });
    }
},
validateWalletAddress: async (req, res) => {
    const userId = req.user._id || req.user.id;
    const {address, blockchain } = req.query; // Get wallet address and blockchain from query params

    // Check for required parameters
    if (!address || !blockchain) {
      return res.status(400).json({
        status: 400,
        message: 'Wallet address and blockchain are required',
        data: null,
      });
    }

    try {
       const getData = await fetchVaultDetails(userId);
      const vaultToken = getData?.vaultUser?.access_token;

      if (!vaultToken) {
        return res.status(401).json({
          status: 401,
          message: "Vault access token not found",
          data: null,
        });
      }
      // Make the GET request to validate the wallet address
       const response = await axios.get(`${VAULT_BASE_URL}/wallet/v2/address/format/validation`, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,
        ...VAULT_HEADERS(),
      },
      params: {
         address,
         blockchain
      },
    });

      // If the response status is 200, it means the wallet address is valid
      if (response.status === 200) {
         const { valid, validChecksum, internal } = response.data;
          // Save wallet data along with validation status
        const newWallet = await Wallet.findOneAndUpdate(
          { userId: req.user._id, address: address },
          {
            $set: {
              valid,           
              validChecksum,   
              internal,        
            }
          },
          { new: true, upsert: true } 
        );

        return res.status(200).json({
          status: 200,
          message: 'Wallet address is valid',
          data: response.data, // Returning the validation result
        });
        
      } else {
        // If response is not 200, print the status code and message
        return res.status(response.status).json({
          status: response.status,
          message: response.data?.message || 'Error validating wallet address',
          data: response.data || null,
        });
      }

    } catch (error) {
      // Handle errors like network issues or invalid responses
      console.error("❌ Wallet Address Validation Error:", error?.response?.data || error.message);
      return res.status(error?.response?.status || 500).json({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Internal server error while validating the wallet address.",
        data: error?.response?.data || null,
      });
 }
},
getWalletByUserId : async (req, res) => {
  const userId = req.user._id || req.user.id;  // Assuming the userId is coming from the authenticated user in the request

  try {
    // Check if the userId is present
    if (!userId) {
      return res.status(400).json({
        status: 400,
        message: 'User ID is required',
        data: null,
      });
    }

    // Fetch wallets based on userId
    const wallets = await Wallet.find({ userId });

    // If no wallets found for the user
    if (!wallets || wallets.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No wallets found for this user',
        data: null,
      });
    }

    // Successfully found wallets
    return res.status(200).json({
      status: 200,
      message: 'Wallets fetched successfully',
      data: wallets,
    });

  } catch (error) {
    console.error('Error fetching wallet by userId:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
},
 getBalanceLog : async (req, res) => {
  const userId = req.user._id || req.user.id;

   const getData = await fetchVaultDetails(userId);
      const vaultToken = getData?.vaultUser?.access_token;

      if (!vaultToken) {
        return res.status(401).json({
          status: 401,
          message: "Vault access token not found",
          data: null,
        });
      }
  // The URL of the Vault API endpoint
  const url = `${VAULT_BASE_URL}/wallet/v1/balance/log`;

  try {
    // Make the API call with the vault token
    const response = await axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          ...VAULT_HEADERS(),
        },
      },
    );

    // Log the response from the Vault API
    console.log("Vault API Response:", response.data);

    // Return the response to the client
    return res.status(200).json({
      status: 200,
      message: "Balance logs fetched successfully",
      data: response.data,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching balance log:", error);
    return res.status(500).json({
      status: 500,
      message: error?.response?.data?.message || "Error fetching balance logs",
      data: error?.response?.data || null,
    });
  }
},
getBalanceLogById : async (req, res) => {
  const userId = req.user._id || req.user.id;

  const { id } = req.params;

  // Check if the 'id' is provided
  if (!id) {
    return res.status(400).json({
      status: 400,
      message: "Transaction ID (UUID) is required",
      data: null,
    });
  }

  // Fetch the user's vault details to get the vault token
  const getData = await fetchVaultDetails(userId);
  const vaultToken = getData?.vaultUser?.access_token;

  // If vaultToken is not found, return an error
  if (!vaultToken) {
    return res.status(401).json({
      status: 401,
      message: "Vault access token not found",
      data: null,
    });
  }

  // URL for the specific transaction log, with the UUID
  const url = `${VAULT_BASE_URL}/wallet/v1/balance/log/${id}`;

  try {
    // Make the API call with the vault token and the provided 'id'
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,
        ...VAULT_HEADERS(),
      },
    });

    // Log the response from the Vault API
    console.log("Vault API Response:", response.data);

    // Return the response to the client
    return res.status(200).json({
      status: 200,
      message: "Balance log fetched successfully",
      data: response.data,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching balance log by ID:", error);
    return res.status(500).json({
      status: 500,
      message: error?.response?.data?.message || "Error fetching balance log by ID",
      data: error?.response?.data || null,
    });
  }
},
getBalance : async (req, res) => {
  const userId = req.user._id || req.user.id;

  // Fetch the user's vault details
  const getData = await fetchVaultDetails(userId);
  const vaultToken = getData?.vaultUser?.access_token;

  // Check if vaultToken exists
  if (!vaultToken) {
    return res.status(401).json({
      status: 401,
      message: "Vault access token not found",
      data: null,
    });
  }

  // URL for fetching balance
  const url = `${VAULT_BASE_URL}/wallet/v1/balance`;

  try {
    // Make the GET request to fetch the balance
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${vaultToken}`,
        ...VAULT_HEADERS(),
      },
    });

    // Log the response from the Vault API
    console.log("Vault API Response:", response.data);

    // Return the response to the client
    return res.status(200).json({
      status: 200,
      message: "Balance fetched successfully",
      data: response.data,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching balance:", error);
    return res.status(500).json({
      status: 500,
      message: error?.response?.data?.message || "Error fetching balance",
      data: error?.response?.data || null,
    });
  }
},
};