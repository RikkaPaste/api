var express = require('express');
var router = express.Router();
const expressController = require("../../controllers/ExpressController");

router.post('/listexpress', expressController.list);
router.post('/addexpress',expressController.add);
router.post('/oneexpress',expressController.findById);
router.post('/updexpress',expressController.upd);
router.post('/delexpress',expressController.del);

module.exports = router;