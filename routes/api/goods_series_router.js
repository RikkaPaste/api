var express = require('express');
var router = express.Router();
const goodsSeriesController = require("../../controllers/GoodsSeriesController");

router.post('/listgoods_series', goodsSeriesController.list);
router.post('/addgoods_series',goodsSeriesController.add);
router.post('/onegoods_series',goodsSeriesController.findById);
router.post('/updgoods_series',goodsSeriesController.upd);
router.post('/delgoods_series',goodsSeriesController.del);
router.post('/findbyname',goodsSeriesController.findByName);

module.exports = router;