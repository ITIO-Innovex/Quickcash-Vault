const express = require('express');
const router = express.Router();
const {verifyOurToken} = require("../../Middlewares/VerifyToken");
const {checkVaultToken} = require("../../Middlewares/CheckVaultToken")
const {registerUser,confirmSignup,loginUser,logoutUser,checkKYCStatus,getVaultUser,changeVaultPassword,userAllSessions,changeVaultPasswordConfirm,resetPassword
,resetPasswordConfirm,resetPasswordExecute,fetchSubscriptionDetails
} = require('../../Controller/Customer/AuthController'); 

router.post('/login', loginUser);  
router.post('/signup',registerUser); 
router.post('/confirm',confirmSignup);  
router.post('/password/reset', resetPassword);
router.delete('/logout', verifyOurToken,logoutUser);
router.get('/kyc-status', verifyOurToken, checkKYCStatus);
router.post('/password/reset/confirm',resetPasswordConfirm);
router.post('/password/reset/execute', resetPasswordExecute);
router.get('/subscription-details', verifyOurToken,fetchSubscriptionDetails ); 
router.get('/all-sessions',verifyOurToken, checkVaultToken,userAllSessions); 
router.get('/vault/user-info', verifyOurToken, checkVaultToken , getVaultUser);
router.post('/password/change', verifyOurToken,checkVaultToken, changeVaultPassword);
router.post('/password/change/confirm', verifyOurToken, checkVaultToken, changeVaultPasswordConfirm);

module.exports = router;
