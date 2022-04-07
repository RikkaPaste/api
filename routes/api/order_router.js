var express = require('express');
var router = express.Router();
const orderController = require("../../controllers/OrderController");

router.post('/listorder', orderController.list);
router.post('/addorder',orderController.add);
router.post('/oneorder',orderController.findById);
router.post('/updorder',orderController.upd);
router.post('/delorder',orderController.del);
router.post('/getcount',orderController.getCount);


module.exports = router;