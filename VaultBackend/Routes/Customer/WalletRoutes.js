const express = require("express");
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken")
const { getWalletAccount , getWalletAccountById} = require("../../Controller/Customer/WalletController");

// Route to get all wallet accounts
router.get("/all-accounts", verifyOurToken, checkVaultToken, getWalletAccount);
// Route to get a specific wallet account by ID
router.get("/account/:accountId", verifyOurToken, checkVaultToken, getWalletAccountById);

module.exports = router;
