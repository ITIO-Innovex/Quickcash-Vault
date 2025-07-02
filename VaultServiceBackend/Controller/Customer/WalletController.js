const express = require("express");
const axios = require("axios");
const { fetchVaultDetails } = require("../../Utils/fetchVaultDetails");
const SubscriptionPlan = require('../../Models/Customer/subscriptionPlanModel');
const { VAULT_HEADERS,VAULT_WALLET_URL } = require("../../Config/VaultConfig");

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
}
}