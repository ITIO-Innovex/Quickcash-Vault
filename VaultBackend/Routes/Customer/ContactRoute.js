const express = require('express');
const router = express.Router();
const { sendContactMail } = require('../../Controller/Customer/ContactController');

router.post('/send', sendContactMail);

module.exports = router;
