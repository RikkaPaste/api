var express = require('express');
var router = express.Router();
const rolesController = require("../../controllers/RolesController");

router.post('/listroles', rolesController.list);
router.post('/listallroles',rolesController.listAll);
router.post('/addroles',rolesController.add);
router.post('/oneroles',rolesController.findById);
router.post('/updroles',rolesController.upd);
router.post('/delroles',rolesController.del);

module.exports = router;