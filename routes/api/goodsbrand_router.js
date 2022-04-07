var express = require('express');
var router = express.Router();
const goodsbrandController = require("../../controllers/GoodsbrandController");

router.post('/listgoodsbrand', goodsbrandController.list);
router.post('/addgoodsbrand',goodsbrandController.add);
router.post('/onegoodsbrand',goodsbrandController.findById);
router.post('/updgoodsbrand',goodsbrandController.upd);
router.post('/delgoodsbrand',goodsbrandController.del);

module.exports = router;