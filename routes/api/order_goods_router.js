var express = require('express');
var router = express.Router();
const orderGoodsController = require("../../controllers/OrderGoodsController");

router.post('/listorder_goods', orderGoodsController.list);
router.post('/addorder_goods',orderGoodsController.add);
router.post('/oneorder_goods',orderGoodsController.findById);
router.post('/updorder_goods',orderGoodsController.upd);
router.post('/delorder_goods',orderGoodsController.del);

module.exports = router;