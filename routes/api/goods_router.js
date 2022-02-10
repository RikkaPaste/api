var express = require('express');
var router = express.Router();
const goodsController = require("../../controllers/GoodsController");

router.post('/listgoods', goodsController.list);
router.post('/finds', goodsController.finds);
router.post('/bycateid', goodsController.findByCateId);
router.post('/addgoods',goodsController.add);
router.post('/onegoods',goodsController.findById);
router.post('/updgoods',goodsController.upd);
router.post('/delgoods',goodsController.del);
router.post('/findforlayout',goodsController.findForLayout);

module.exports = router;