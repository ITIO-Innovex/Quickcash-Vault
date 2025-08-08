const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken");
const { handlePayinRequest, getAllPayin, payinById, handleWithdrawal, createDirectExchange } = require('../../Controller/Customer/OperationController');

// Route for the payin request
router.post('/payin', verifyOurToken, checkVaultToken, handlePayinRequest);
//Route to get all payin transactions
router.get('/payin-all', verifyOurToken, checkVaultToken, getAllPayin);
// Route to get payin by ID
router.get('/payin/:id', verifyOurToken, checkVaultToken, payinById);
// Route to handle withdrawal requests
router.post('/withdraw', verifyOurToken, checkVaultToken, handleWithdrawal);
// Route definition
router.post('/direct-exchange',verifyOurToken, checkVaultToken, createDirectExchange);

module.exports = router;
