const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken")
const { getSumsubToken, updateSumsubKyc,getVerificationData, upgradeSumsubToken}  = require('../../Controller/Customer/SumsubController');

router.get('/sumsub/token', verifyOurToken, checkVaultToken,getSumsubToken);
router.post('/kyc-status', verifyOurToken, checkVaultToken,updateSumsubKyc);
router.get('/sumsub/data', verifyOurToken, checkVaultToken, getVerificationData);
router.post('/sumsub/token-upgrade', verifyOurToken, checkVaultToken, upgradeSumsubToken);
module.exports = router;