const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken")
const { getSumsubToken,updateSumsabKyc}  = require('../../Controller/Customer/SumsubController');

router.get('/sumsub/token', verifyOurToken, checkVaultToken,getSumsubToken);
router.post('/kyc-status', updateSumsabKyc);
module.exports = router;