const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken")
const { fetchCardOffers, getCardRequests, createCardRequest, deleteCardRequest, setCardholderName, setCardAddress, getPlasticDeliveryCountries, getCardTransactions, getCardList, changeCardStatus, activateCard, getCardDetails, updateCardPin, getCardSensitiveDetails, getCardFullDetails } = require('../../Controller/Customer/CardsController');

//Route for fetching card offers
router.get('/offers', verifyOurToken, checkVaultToken, fetchCardOffers);
// Route for fetching card requests
router.get('/requests', verifyOurToken, checkVaultToken, getCardRequests);
// Route for creating a card request
router.post('/create', verifyOurToken, checkVaultToken, createCardRequest);
//Route for deleting a card request
router.delete('/delete/:cardRequestId', verifyOurToken, checkVaultToken, deleteCardRequest);
// Route for posting cardholder name
router.post('/set-name', verifyOurToken, checkVaultToken, setCardholderName);
// Route for posting card address
router.post('/:cardRequestId/set-address', verifyOurToken, checkVaultToken, setCardAddress);
// Route for updating card request address
router.get('/available-countries', verifyOurToken, checkVaultToken, getPlasticDeliveryCountries);
// Route for getting card transactions
router.get('/:cardId/transactions', verifyOurToken, checkVaultToken, getCardTransactions);

//Cards Features

// Route for getting all cards
router.get('/all', verifyOurToken, checkVaultToken, getCardList);
// Route for changing card status
router.post('/change-status', verifyOurToken, checkVaultToken, changeCardStatus);
// Route for activating a card
router.post('/:cardId/activate', verifyOurToken, checkVaultToken, activateCard);
// Route for getting card details
router.get('/:cardId/details', verifyOurToken, checkVaultToken, getCardDetails);
// Route for updating card PIN
router.put('/:cardId/pin', verifyOurToken, checkVaultToken, updateCardPin);
// Route for getting sensitive card details
router.get('/:cardId/sensitive-details', verifyOurToken, checkVaultToken, getCardSensitiveDetails);
// Route for getting full card details
router.get('/:cardId/all-details', verifyOurToken, checkVaultToken, getCardFullDetails);


module.exports = router;