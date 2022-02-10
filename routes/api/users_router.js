var express = require('express');
var router = express.Router();
const usersController = require("../../controllers/UsersController");
/**
 * @typedef Response
 * @property {integer} code.required - 状态码，成功200，失败500 - eg:200
 * @property {string} data.required - json对象数据 - eg:{}
 * @property {string} msg.required - 提示信息 - eg:提示信息
 */
/**
 * @typedef LoginUser
 * @property {string} username.required - 用户名 - eg:admin
 * @property {string} passwd.required - 密码 - eg:123456
 */
/**
 * @typedef ListUser
 * @property {integer} pageNo.required - 当前页数 - eg:1
 * @property {integer} pageSize.required - 每页记录数 - eg:2
 */
/**
 * @typedef AddUser
 * @property {integer} id - 主键，只有添加的使用要用 - eg:0
 * @property {string} username.required - 用户名 - eg:admin
 * @property {string} passwd.required - 密码 - eg:123456
 * @property {string} email - 邮箱 - eg:qq@qq.com
 * @property {string} mobile - 手机 - eg:13888888888
 * @property {integer} roleid - 角色id - eg:0
 * @property {integer} create_stamp.required - 创建时间戳单位毫秒 - eg:1342412342123
 * @property {integer} update_stamp.required - 更新时间戳单位毫秒 - eg:1342412342123
 */
/**
 * 分页查询
 * @route Post /users/listusers
 * @group 后台管理员 - 关于后台管理员的相关接口
 * @param {ListUser.model} ListUser.body - json对象
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/listusers', usersController.list);
/**
 * 添加管理员
 * @route Post /users/addusers
 * @group 后台管理员 - 关于后台管理员的相关接口
 * @param {AddUser.model} AddUser.body - json对象
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/addusers',usersController.add);
/**
 * 根据id查询管理员
 * @route Post /users/oneusers
 * @group 后台管理员 - 关于后台管理员的相关接口
 * @param {AddUser.model} id.body.required - json对象,只需要id
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/oneusers',usersController.findById);
/**
 * 更新管理员
 * @route Post /users/updusers
 * @group 后台管理员 - 关于后台管理员的相关接口
 * @param {AddUser.model} AddUser.body - json对象，更新需要传主键id
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/updusers',usersController.upd);
/**
 * 根据id删除管理员
 * @route Post /users/delusers
 * @group 后台管理员 - 关于后台管理员的相关接口
 * @param {AddUser.model} id.body.required - json对象,只需要id
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/delusers',usersController.del);
/**
 * 登录接口
 * @route POST /users/login
 * @group 后台管理员 - 关于后台管理员的相关接口
 * @param {LoginUser.model} LoginUser.body - json对象 - eg: {"username":"admin","passwd":"123456"}
 * @returns {Response.model} 200 - 登录接口返回的json对象数据
 * @returns {Error}  default - Unexpected error
 */
router.post('/login',usersController.login);
module.exports = router;