var express = require('express');
var router = express.Router();
const menuController = require("../../controllers/MenuController");

router.post('/listmenu', menuController.list);
router.post('/addmenu',menuController.add);
router.post('/onemenu',menuController.findById);
router.post('/updmenu',menuController.upd);
router.post('/delmenu',menuController.del);
router.post('/listpagemenu',menuController.listPage);
router.post('/findbyparentid',menuController.findByParentId);
module.exports = router;