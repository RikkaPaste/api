var express = require('express');
var router = express.Router();
const tixianListController = require("../../controllers/TixianListController");

router.post('/listtixianlist', tixianListController.list);

router.post('/addtixianlist',tixianListController.add);

router.post('/onetixianlist',tixianListController.findById);

router.post('/updtixianlist',tixianListController.upd);

router.post('/deltixianlist',tixianListController.del);

module.exports = router;