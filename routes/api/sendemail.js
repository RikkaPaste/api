var express = require('express');
var router = express.Router();
const sendEmailController 
= require("../../controllers/SendEmailController");
router.post('/send', sendEmailController.send);
module.exports = router;