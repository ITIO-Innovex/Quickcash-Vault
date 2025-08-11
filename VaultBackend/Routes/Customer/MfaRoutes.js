const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken");
const {switchMfaAuthorization } = require('../../Controller/Customer/MfaController');

//Route to enabla MFA on user's account
router.post('/enable', verifyOurToken, checkVaultToken, switchMfaAuthorization);

module.exports = router;