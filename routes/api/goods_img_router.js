var express = require('express');
var router = express.Router();
const goodsImgController = require("../../controllers/GoodsImgController");

router.post('/listgoods_img', goodsImgController.list);
router.post('/addgoods_img',goodsImgController.add);
router.post('/onegoods_img',goodsImgController.findById);
router.post('/updgoods_img',goodsImgController.upd);
router.post('/delgoods_img',goodsImgController.del);

module.exports = router;