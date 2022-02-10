var express = require('express');
var router = express.Router();
const swiperController = require("../../controllers/SwiperController");
/**
 * @typedef Response
 * @property {integer} code.required - 状态码，成功200，失败500 - eg:200
 * @property {string} data.required - json对象数据 - eg:{}
 * @property {string} msg.required - 提示信息 - eg:提示信息
 */
/**
 * @typedef ListSwiper
 * @property {integer} pageNo.required - 当前页数 - eg:1
 * @property {integer} pageSize.required - 每页记录数 - eg:2
 */
/**
 * @typedef AddSwiper
 * @property {integer} id - 序号 - eg:
 * @property {string} imgurl - 图片链接 - eg:
 * @property {string} naviurl - 跳转路径 - eg:
 * @property {datetime} createdAt - 创建时间 - eg:
 * @property {datetime} updatedAt - 更新时间 - eg:
 * @property {integer} chk_status - 是否有效 1.是 2.否 - eg:
 */
/**
 * 分页查询
 * @route Post /swiper/listswiper
 * @group 轮播图管理 - 关于轮播图管理的相关接口
 * @param {ListSwiper.model} ListSwiper.body - json对象
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/listswiper', swiperController.list);
/**
 * 添加
 * @route Post /swiper/addswiper
 * @group 轮播图管理 - 关于轮播图管理的相关接口
 * @param {AddSwiper.model} AddSwiper.body - json对象
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/addswiper',swiperController.add);
/**
 * 根据id查询
 * @route Post /swiper/oneswiper
 * @group 轮播图管理 - 关于轮播图管理的相关接口
 * @param {Addswiper.model} id.body.required - json对象,只需要id
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/oneswiper',swiperController.findById);
/**
 * 更新
 * @route Post /swiper/updswiper
 * @group 轮播图管理 - 关于轮播图管理的相关接口
 * @param {Addswiper.model} Addswiper.body - json对象，更新需要传主键id
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/updswiper',swiperController.upd);
/**
 * 根据id删除
 * @route Post /swiper/delswiper
 * @group 轮播图管理 - 关于轮播图管理的相关接口
 * @param {Addswiper.model} id.body.required - json对象,只需要id
 * @returns {Response.model} 200 - 登录接口返回的json对象数据 
 * @security JWT
 * @returns {Error}  default - Unexpected error
 */
router.post('/delswiper',swiperController.del);

module.exports = router;