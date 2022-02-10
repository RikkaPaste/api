var express = require('express');
var router = express.Router();
const goodsdescController = require("../../controllers/GoodsdescController");

router.post('/listgoodsdesc', goodsdescController.list);
router.post('/addgoodsdesc',goodsdescController.add);
router.post('/onegoodsdesc',goodsdescController.findById);
router.post('/updgoodsdesc',goodsdescController.upd);
router.post('/delgoodsdesc',goodsdescController.del);
router.post('/findbygoodsid',goodsdescController.findByGoodsId);

module.exports = router;