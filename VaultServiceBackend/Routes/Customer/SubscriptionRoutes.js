const express = require("express");
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken")
const { getAvailableSubscriptionDetails, startSubscription,getCurrentSubscription,fetchInvoice, payInvoice , getInvoices
} = require("../../Controller/Customer/SubscriptionController");

// Get all available subscription plans from Vault
router.get("/available", verifyOurToken, checkVaultToken, getAvailableSubscriptionDetails);

// Start a new subscription
router.post("/start", verifyOurToken, checkVaultToken, startSubscription);

// Get current active subscription and save to DB
router.get("/current", verifyOurToken,checkVaultToken, getCurrentSubscription);

// Invoice Fetch
router.get("/invoice", verifyOurToken,checkVaultToken, fetchInvoice);

// Invoice Payment
router.post('/invoice/payment', verifyOurToken, checkVaultToken, payInvoice);

// Get all invoices
router.get('/invoices', verifyOurToken, checkVaultToken, getInvoices);
module.exports = router;
