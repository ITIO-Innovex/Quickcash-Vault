const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken");
const {  getBlockchainCurrency ,getTokenData, getSummaryToken, getPreferredCurrency, getExchangePairs, getExchangeRate, getAllInstruments,  getInstrumentDetails}  = require('../../Controller/Customer/BlockchainController');

// Route to get all blockchain currencies
router.get('/currencies/all', verifyOurToken, checkVaultToken, getBlockchainCurrency);
// Route to get token data
router.get('/token', verifyOurToken, checkVaultToken, getTokenData);
// Route to get summary token data
router.get('/summary-token', verifyOurToken, checkVaultToken, getSummaryToken);
// Route for getting the preferred currency by account ID
router.get('/preferred/:accountId', verifyOurToken, checkVaultToken, getPreferredCurrency);
// Route to get exchange pairs
router.get('/exchange-pairs', verifyOurToken, checkVaultToken, getExchangePairs);
// Route for getting the exchange rate based on the query parameters
router.get('/rates', verifyOurToken, checkVaultToken, getExchangeRate);
// Route for getting all instruments
router.get('/instruments-all', verifyOurToken, checkVaultToken, getAllInstruments);
// Route for fetching instrument details using the instrument identifier
router.get('/instruments/:instrument',verifyOurToken, checkVaultToken, getInstrumentDetails);


module.exports = router;