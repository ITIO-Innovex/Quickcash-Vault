const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken");
const { createIban, getIban, cancelIbanRequest } = require('../../Controller/Customer/IbanController');

//Route to create a new bank account (IBAN)
router.post('/create', verifyOurToken, checkVaultToken, createIban);
// Route to get all bank accounts
router.get('/all', verifyOurToken, checkVaultToken, getIban);
//Route to cancel a bank account
router.post('cancel',  verifyOurToken, checkVaultToken, cancelIbanRequest);

module.exports = router;