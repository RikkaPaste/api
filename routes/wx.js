var express = require('express');
var router = express.Router();
const goodsController = require("../controllers/WxController");
let xmlparser = require('express-xml-bodyparser');//引入
router.post('/openid', goodsController.getOpenid);
router.post('/prepayid', goodsController.getPrepayId);
router.all('/payback', xmlparser({ trim: false, explicitArray: false }),goodsController.payBack);
module.exports = router;