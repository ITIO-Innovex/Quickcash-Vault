const express = require("express");
const axios = require("axios");
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");
const SubscriptionPlan = require('../../Models/Customer/subscriptionPlanModel');
const { VAULT_HEADERS,VAULT_SUBSCRIPTION_URL,VAULT_BASE_URL } = require("../../Config/VaultConfig");

module.exports = {
  
  getAvailableSubscriptionDetails : async (req, res) => {
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
        `${VAULT_SUBSCRIPTION_URL}/details/available`,
        {
          headers: {
            Authorization: `Bearer ${vaultToken}`,
            ...VAULT_HEADERS(),  // includes Content-Type + partnerId
          },
        }
      );

      return res.status(200).json({
        status: 200,
        message: "Available subscription details fetched successfully",
        data: response.data,
      });
    } catch (error) {
      console.error("Vault API Error:", error?.response?.data || error.message);
      return res.status(error?.response?.status || 500).json({
        status: error?.response?.status || 500,
        message:
          error?.response?.data?.message || "Vault API error or server issue.",
        data: error?.response?.data || null,
      });
    }
  }, 
  startSubscription: async (req, res) => {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);
    
    const { anyCurrency, subscriptionDetailsId } = req.body;

    if (!subscriptionDetailsId) {
      return res.status(400).json({
        status: 400,
        message: "subscriptionDetailsId is required",
        data: null,
      });
    }

    if (!getData || !getData?.vaultUser?.access_token) {
      return res.status(401).json({
        status: 401,
        message: "Vault user not found or missing access token",
        data: null
      });
    }

    try {
      const vaultToken = getData.vaultUser.access_token;

      const response = await axios.post(
      `${VAULT_SUBSCRIPTION_URL}`,
        {
          anyCurrency,
          subscriptionDetailsId,
        },
          {
          headers: {
            Authorization: `Bearer ${vaultToken}`,
            ...VAULT_HEADERS(),  // includes Content-Type + partnerId
          },
        }
      );

      const { id, payUrl } = response.data;

      const updatedSubscription = await SubscriptionPlan.findOneAndUpdate(
        { userId },
        {
          $set: {
            payUrl,
            vaultSubscriptionId: id,
            subscriptionDetails: {
              subscriptionId: subscriptionDetailsId,
            },
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

      return res.status(201).json({
        status: 201,
        message: "Subscription started and saved successfully",
        data: updatedSubscription,
      });
    } catch (error) {
      console.error("Vault API Error:", error?.response?.data || error.message);
      return res.status(error?.response?.status || 500).json({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Vault API error or server issue.",
        data: error?.response?.data || null,
      });
    }
  },
  getCurrentSubscription: async (req, res) => {
    const userId = req.user._id;
    const getData = await fetchVaultDetails(userId);

    if (!getData?.vaultUser?.access_token) {
      return res.status(401).json({
        status: 401,
        message: "Vault user not found or access token missing",
        data: null,
      });
    }

    try {
      const vaultToken = getData.vaultUser.access_token;

      const response = await axios.get(`${VAULT_SUBSCRIPTION_URL}`, {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          ...VAULT_HEADERS(),
        },
      });

      const subscriptionData = response.data;

      // Prepare DB structure
      const newSub = {
        vaultSubscriptionId: subscriptionData.id,
        subscriptionDetails: {
          subscriptionId: subscriptionData.subscriptionDetails?.id,
          name: subscriptionData.subscriptionDetails?.name,
          description: subscriptionData.subscriptionDetails?.description,
          amount: subscriptionData.subscriptionDetails?.amount,
          currency: subscriptionData.subscriptionDetails?.currency,
          initialPaymentAmount: subscriptionData.subscriptionDetails?.initialPaymentAmount,
          subscriptionInterval: subscriptionData.subscriptionDetails?.subscriptionInterval,
          trialAvailable: subscriptionData.subscriptionDetails?.trialAvailable,
          level: subscriptionData.subscriptionDetails?.level,
          mostPopular: subscriptionData.subscriptionDetails?.mostPopular,
        },
        status: subscriptionData.status || 'INIT',
        nextPaymentDate: subscriptionData.nextPaymentDate,
        lastPaymentInvoiceId: subscriptionData.lastPaymentInvoiceId,
        lastPaymentInvoiceStatus: subscriptionData.lastPaymentInvoiceStatus,
        startedAt: new Date(subscriptionData.createdAt),
      };

      // Find existing document
      let existingDoc = await SubscriptionPlan.findOne({ userId });

      if (!existingDoc) {
        await SubscriptionPlan.create({ userId, ...newSub });
      } else {
        Object.assign(existingDoc, newSub);
        await existingDoc.save();
      }

      // Return original Vault-style response
      return res.status(200).json({
        status: 200,
        message: "Subscription synced successfully",
        data: subscriptionData, // 👈 return Vault's original format
      });
    } catch (error) {
      console.error("Vault API Error:", error?.response?.data || error.message);
      return res.status(error?.response?.status || 500).json({
        status: error?.response?.status || 500,
        message:
          error?.response?.data?.message || "Vault API error or server issue.",
        data: error?.response?.data || null,
      });
    }
  },
  getInvoices : async (req, res) => {

    const userId = req.user._id;

    try {
      const getData = await fetchVaultDetails(userId);
      const vaultToken = getData?.vaultUser?.access_token;
    if (!vaultToken) {
      return res.status(401).json({
        status: 401,
        message: "Vault access token not found.",
        data: null,
      });
    }

      const response = await axios.get(`${VAULT_BASE_URL}/acquiring/invoice`, {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          ...VAULT_HEADERS(),
        },
      });

      return res.status(200).json({
        status: 200,
        message: 'Invoices fetched successfully.',
        data: response.data,
      });
    } catch (error) {
      console.error('Error fetching invoices:', error?.response?.data || error.message);
      return res.status(500).json({
        status: 500,
        message: 'Failed to fetch invoices.',
        error: error?.response?.data || error.message,
      });
    }
  },
  fetchInvoice: async (req, res) => {
  const userId = req.user._id;

  try {
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    if (!vaultToken) {
      return res.status(401).json({
        status: 401,
        message: "Vault access token not found.",
        data: null,
      });
    }

    const userSubscription = await SubscriptionPlan.findOne({ userId });

    if (!userSubscription || !userSubscription.lastPaymentInvoiceId) {
      return res.status(404).json({
        status: 404,
        message: "No invoice ID found for the user.",
        data: null,
      });
    }

    const invoiceId = userSubscription.lastPaymentInvoiceId;
    console.log("📄 Invoice ID to fetch:", invoiceId);

    const response = await axios.get(
      `${VAULT_BASE_URL}/acquiring/invoice/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          ...VAULT_HEADERS(),
        },
      }
    );

    return res.status(200).json({
      status: 200,
      message: "Invoice fetched successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ Invoice Fetch Error:", error?.response?.data || error.message);
    return res.status(error?.response?.status || 500).json({
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Error fetching invoice from Vault.",
      data: error?.response?.data || null,
    });
  }
  },
  payInvoice: async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { paymentId, invoiceId, type, accountId, currency, anyCurrency } = req.body;

  if (!invoiceId || !type || !accountId || typeof anyCurrency !== 'boolean') {
    return res.status(400).json({
      status: 400,
      message: "Missing required fields: invoiceId, type, accountId, currency, anyCurrency",
      data: null,
    });
  } 
  try {
    // Step 1: Fetch Vault Token
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token;

    if (!vaultToken) {
      return res.status(401).json({
        status: 401,
        message: "Vault access token not found",
        data: null,
      });
    }
    // Step 2: Prepare Request Body
    const requestBody = {
      invoiceId,
      type,
      accountId,
      currency,
      anyCurrency,
      ...(paymentId && { paymentId }) // optional
    };

    console.log("📦 Sending Payment Payload:", requestBody);

    // Step 3: Vault API Call
    const response = await axios.post(
      `${VAULT_BASE_URL}/acquiring/v1/invoice/payment`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${vaultToken}`,
          ...VAULT_HEADERS(),
        },
      }
    );

    // Step 4: Send Back Response
    return res.status(200).json({
      status: 200,
      message: "Invoice payment request sent successfully",
      data: response.data,
    });

  } catch (error) {
    console.error("❌ Vault Invoice Payment Error:", error?.response?.data || error.message);
    return res.status(error?.response?.status || 500).json({
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Vault API error or server issue.",
      data: error?.response?.data || null,
    });
  }
  },
  confirmPayment: async (req, res) => {
    const userId = req.user._id || req.user.id;
    const { paymentId, invoiceId, type, accountId, anyCurrency } = req.body;
  
    if (!invoiceId || !type || !accountId) {
      return res.status(400).json({
        status: 400,
        message: "invoiceId, type, and accountId are required",
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

      // Prepare request body dynamically
      const requestBody = {
        invoiceId,
        type,
        accountId,
        ...(paymentId && { paymentId }),
        anyCurrency,
      };
  
      const response = await axios.post(
        `${VAULT_BASE_URL}/acquiring/invoice/payment/pay`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${vaultToken}`,
            ...VAULT_HEADERS(),
          },
        }
      );
  
      return res.status(200).json({
        status: 200,
        message: "Invoice payment request sent successfully",
        data: response.data,
      });
  
    } catch (error) {
      console.error("Vault API Error:", error?.response?.data || error.message);
      return res.status(error?.response?.status || 500).json({
        status: error?.response?.status || 500,
        message:
          error?.response?.data?.message || "Vault API error or server issue.",
        data: error?.response?.data || null,
      });
    }
  },
updateInvoicePayment: async (req, res) => {
  const userId = req.user._id || req.user.id;  // Get the userId from the authenticated request
  const { paymentId, invoiceId, type, accountId, anyCurrency } = req.body; // Extracting data from request body

  // Check if the required parameters are provided in the request body
  if (!paymentId || !invoiceId || !type || !accountId || anyCurrency === undefined) {
    return res.status(400).json({
      status: 400,
      message: "paymentId, invoiceId, type, accountId, and anyCurrency are required",
      data: null,
    });
  }

  try {
    // Fetch the Vault token using the userId
    const getData = await fetchVaultDetails(userId);
    const vaultToken = getData?.vaultUser?.access_token; // Vault token is retrieved

    if (!vaultToken) {
      return res.status(401).json({
        status: 401,
        message: "Vault access token not found",
        data: null,
      });
    }

    // Prepare the request body dynamically
    const requestBody = {
      paymentId,
      invoiceId,
      type,
      accountId,
      anyCurrency,
    };

   console.log("Sending request to Vault:", requestBody);
   console.log(`Vault Token: ${vaultToken}`)

   try{
      const response = await axios.post(
        `${VAULT_BASE_URL}/acquiring/invoice/payment`,
         requestBody,
        { headers: { Authorization: `Bearer ${vaultToken}`, ...VAULT_HEADERS() } }
      );
      return res.status(200).json({
        status: 200,
        message: "Invoice payment request sent successfully",
        data: response.data,
      });
   }catch(err){
    console.log(err);
      return res.status(503).json({
        status: 503,
        message: "Invoice payment request sent failed",
        data: err,
      });
   }
  
    } catch (error) {
      console.error("Vault API Error:", error?.response?.data || error.message);
      return res.status(error?.response?.status || 500).json({
        status: error?.response?.status || 500,
        message:
          error?.response?.data?.message || "Vault API error or server issue.",
        data: error?.response?.data || null,
      });
    }
  },
  renewSubscription: async (req, res) => {
    try {
      const user = req.user;

      if (!user || !user.vaultUser || !user.vaultUser.access_token) {
        return res.status(404).json({
          status: 404,
          message: "Vault access token not found for the user",
          data: null,
        });
      }

      const vaultToken = user.vaultUser.access_token;
      const subscriptionId = req.params.subscriptionId;

      const url = `${VAULT_BASE_URL}/reg/subscription/${subscriptionId}/renew`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${vaultToken}`,
          },
        }
      );

      console.log("Vault API Response:", response.data);

      return res.status(200).json({
        status: 200,
        message: "Subscription renewed successfully",
        data: response.data,
      });
    } catch (error) {
      console.error("Vault API Error:", error.response?.data || error.message);
      return res.status(500).json({
        status: 500,
        message: "Failed to renew subscription",
        error: error.response?.data || error.message,
      });
    }
  },
  fetchSubscription : async (req, res) => {
  const userId = req.user.id;

  try {
    const subscription = await SubscriptionPlan.findOne({ userId });

    if (!subscription) {
      return res.status(200).json({
        status: 200,
        message: "No subscription found for this user.",
        data: null,
      });
    }

    // Subscription found, return it
    return res.status(200).json({
      status: 200,
      message: "Subscription found",
      data: subscription,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error.message);
    return res.status(500).json({
      status: 500,
      message: "Server error while fetching subscription.",
      data: error.message,
    });
  }
  }
};

