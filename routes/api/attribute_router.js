var express = require('express');
var router = express.Router();
const attributeController = require("../../controllers/AttributeController");

router.post('/listattribute', attributeController.list);
router.post('/addattribute',attributeController.add);
router.post('/oneattribute',attributeController.findById);
router.post('/updattribute',attributeController.upd);
router.post('/delattribute',attributeController.del);
router.post('/findbycateidandsel',attributeController.findByCateIdAndSel);


module.exports = router;