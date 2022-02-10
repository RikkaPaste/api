var express = require('express');
var router = express.Router();
const goodscategoryController = require("../../controllers/GoodscategoryController");

router.post('/listgoodscategory', goodscategoryController.list);
router.post('/addgoodscategory',goodscategoryController.add);
router.post('/onegoodscategory',goodscategoryController.findById);
router.post('/updgoodscategory',goodscategoryController.upd);
router.post('/delgoodscategory',goodscategoryController.del);
router.post('/gethaschildren',goodscategoryController.getHasChildren);
router.post('/getlevel',goodscategoryController.getLevel);

module.exports = router;