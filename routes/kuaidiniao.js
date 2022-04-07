var express = require('express');
var router = express.Router();
const goodsController = require("../controllers/KuaidiniaoController");

router.post('/find', goodsController.find);
module.exports = router;