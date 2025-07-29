const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {  getBlockchainCurrency }  = require('../../Controller/Customer/BlockchainController');

router.get('/currencies/all', verifyOurToken, getBlockchainCurrency);

module.exports = router;