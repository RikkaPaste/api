var express = require('express');
var router = express.Router();
const consigneeController = require("../../controllers/ConsigneeController");

router.post('/listconsignee', consigneeController.list);
router.post('/addconsignee',consigneeController.add);
router.post('/oneconsignee',consigneeController.findById);
router.post('/updconsignee',consigneeController.upd);
router.post('/delconsignee',consigneeController.del);

module.exports = router;