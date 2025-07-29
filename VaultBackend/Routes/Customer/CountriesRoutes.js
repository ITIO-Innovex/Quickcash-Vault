const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken")
const { getCountriesList, getStatesList } = require('../../Controller/Customer/CountryController');

router.get('/all', verifyOurToken, checkVaultToken, getCountriesList);
router.get('/all-states', verifyOurToken, checkVaultToken, getStatesList)

module.exports = router;
