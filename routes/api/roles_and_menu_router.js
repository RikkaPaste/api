var express = require('express');
var router = express.Router();
const rolesAnd_MenuController = require("../../controllers/RolesAndMenuController");

router.post('/listroles_and_menu', rolesAnd_MenuController.list);
router.post('/addroles_and_menu',rolesAnd_MenuController.add);
router.post('/oneroles_and_menu',rolesAnd_MenuController.findById);
router.post('/updroles_and_menu',rolesAnd_MenuController.upd);
router.post('/delroles_and_menu',rolesAnd_MenuController.del);

module.exports = router;