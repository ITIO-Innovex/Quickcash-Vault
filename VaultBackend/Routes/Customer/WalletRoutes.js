const express = require("express");
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken")
const { getWalletAccount , getWalletAccountById, getWalletAddress, validateWalletAddress, getWalletByUserId, getBalanceLog, getBalanceLogById, getBalance} = require("../../Controller/Customer/WalletController");

// Route to get all wallet accounts
router.get("/all-accounts", verifyOurToken, checkVaultToken, getWalletAccount);
// Route to get a specific wallet account by ID
router.get("/account/:accountId", verifyOurToken, checkVaultToken, getWalletAccountById);
// Route to get wallet address
router.get('/address',verifyOurToken, checkVaultToken, getWalletAddress);
// Route to validate wallet addres
router.get('/validate', verifyOurToken, checkVaultToken,validateWalletAddress);
// Route to get all wallets by user ID
router.get('/all-wallets', verifyOurToken, checkVaultToken ,getWalletByUserId);
// Route to get balance log
router.get('/balance-log', verifyOurToken, checkVaultToken ,getBalanceLog);
// Route to get balance log by transaction id
router.get('/balance-log/:id', verifyOurToken, checkVaultToken ,getBalanceLogById);
// Route to get total wallet balance
router.get('/balance-all', verifyOurToken, checkVaultToken ,getBalance);
module.exports = router;
