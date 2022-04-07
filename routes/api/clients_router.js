var express = require('express');
var router = express.Router();
const clientsController = require("../../controllers/ClientsController");

router.post('/list', clientsController.list);
router.post('/add',clientsController.add);
router.post('/one',clientsController.findById);
router.post('/upd',clientsController.upd);
router.post('/del',clientsController.del);
router.post('/loginbyopenid',clientsController.loginByOpenid);
module.exports = router;