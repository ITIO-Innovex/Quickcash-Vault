const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken");
const { validateReferralCode } = require('../../Controller/Customer/ReferralController');

router.post('/validate',verifyOurToken,checkVaultToken, validateReferralCode);

module.exports = router;