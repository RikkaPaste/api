var DataTypes = require("sequelize").DataTypes;
var _attribute = require("./attribute");
var _clients = require("./clients");
var _consignee = require("./consignee");
var _express = require("./express");
var _goods = require("./goods");
var _goodsbrand = require("./goodsbrand");
var _goodscategory = require("./goodscategory");
var _goodsdesc = require("./goodsdesc");
var _goodsimg = require("./goodsimg");
var _goodsseries = require("./goodsseries");
var _menu = require("./menu");
var _order = require("./order");
var _ordergoods = require("./ordergoods");
var _roles = require("./roles");
var _rolesandmenu = require("./rolesandmenu");
var _sequelizemeta = require("./sequelizemeta");
var _swiper = require("./swiper");
var _tixianlist = require("./tixianlist");
var _users = require("./users");

function initModels(sequelize) {
  var attribute = _attribute(sequelize, DataTypes);
  var clients = _clients(sequelize, DataTypes);
  var consignee = _consignee(sequelize, DataTypes);
  var express = _express(sequelize, DataTypes);
  var goods = _goods(sequelize, DataTypes);
  var goodsbrand = _goodsbrand(sequelize, DataTypes);
  var goodscategory = _goodscategory(sequelize, DataTypes);
  var goodsdesc = _goodsdesc(sequelize, DataTypes);
  var goodsimg = _goodsimg(sequelize, DataTypes);
  var goodsseries = _goodsseries(sequelize, DataTypes);
  var menu = _menu(sequelize, DataTypes);
  var order = _order(sequelize, DataTypes);
  var ordergoods = _ordergoods(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var rolesandmenu = _rolesandmenu(sequelize, DataTypes);
  var sequelizemeta = _sequelizemeta(sequelize, DataTypes);
  var swiper = _swiper(sequelize, DataTypes);
  var tixianlist = _tixianlist(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  rolesandmenu.belongsTo(menu, { as: "menu", foreignKey: "menuid"});
  menu.hasMany(rolesandmenu, { as: "rolesandmenus", foreignKey: "menuid"});
  rolesandmenu.belongsTo(roles, { as: "role", foreignKey: "roleid"});
  roles.hasMany(rolesandmenu, { as: "rolesandmenus", foreignKey: "roleid"});

  return {
    attribute,
    clients,
    consignee,
    express,
    goods,
    goodsbrand,
    goodscategory,
    goodsdesc,
    goodsimg,
    goodsseries,
    menu,
    order,
    ordergoods,
    roles,
    rolesandmenu,
    sequelizemeta,
    swiper,
    tixianlist,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
