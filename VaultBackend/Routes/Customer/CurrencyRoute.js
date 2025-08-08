const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken");
const { getCurrencyList, getCurrencyBySlug, getCurrencyShortList, getCurrencyByName} = require('../../Controller/Customer/CurrencyController');

// Route for getting the list of currencies
router.get('/all', verifyOurToken ,checkVaultToken ,getCurrencyList);
// Route for getting currency by slug
router.post('/slug', verifyOurToken, checkVaultToken ,getCurrencyBySlug);
// Route for getting the currency short list
router.get('/short', verifyOurToken, checkVaultToken, getCurrencyShortList);
// Route for getting the currency by name
router.get('/name', verifyOurToken, checkVaultToken, getCurrencyByName);

module.exports = router;
