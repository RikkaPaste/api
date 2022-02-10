const db = require("../models/index");
const menu = db.sequelize.import("../models/menu");
const user = db.sequelize.import("../models/users");
const roleAndMenu = db.sequelize.import("../models/roles_and_menu");
const {Op} = require('sequelize');
var createError = require('http-errors');
var indexRouter = require('../routes/index');
var attributeRouter = require('../routes/api/attribute_router.js');
var clientsRouter = require('../routes/api/clients_router.js');
var consigneeRouter = require('../routes/api/consignee_router.js');
var expressRouter = require('../routes/api/express_router.js');
var goodsRouter = require('../routes/api/goods_router.js');
var goodsAttrRouter = require('../routes/api/goods_attr_router.js');
var goodsImgRouter = require('../routes/api/goods_img_router.js');
var goodsSeriesRouter = require('../routes/api/goods_series_router.js');
var goodsbrandRouter = require('../routes/api/goodsbrand_router.js');
var goodscategoryRouter = require('../routes/api/goodscategory_router.js');
var goodsdescRouter = require('../routes/api/goodsdesc_router.js');
var menuRouter = require('../routes/api/menu_router.js');
var orderRouter = require('../routes/api/order_router.js');
var orderGoodsRouter = require('../routes/api/order_goods_router.js');
var rolesRouter = require('../routes/api/roles_router.js');
var rolesAnd_MenuRouter = require('../routes/api/roles_and_menu_router.js');
var swiperRouter = require('../routes/api/swiper_router.js');
var usersRouter = require('../routes/api/users_router.js');
var uploadRouter = require('../routes/upload.js');
module.exports={
    routeUseLines(app){ 
        app.use('/upload',uploadRouter);
        app.use('/', indexRouter);
        app.use('/attribute',attributeRouter);
        app.use('/clients',clientsRouter);
        app.use('/consignee',consigneeRouter);
        app.use('/express',expressRouter);
        app.use('/goods',goodsRouter);
        app.use('/goods_attr',goodsAttrRouter);
        app.use('/goods_img',goodsImgRouter);
        app.use('/goods_series',goodsSeriesRouter);
        app.use('/goodsbrand',goodsbrandRouter);
        app.use('/goodscategory',goodscategoryRouter);
        app.use('/goodsdesc',goodsdescRouter);
        app.use('/menu',menuRouter);
        app.use('/order',orderRouter);
        app.use('/order_goods',orderGoodsRouter);
        app.use('/roles',rolesRouter);
        app.use('/roles_and_menu',rolesAnd_MenuRouter);
        app.use('/swiper',swiperRouter);
        app.use('/users',usersRouter);
    },
    publicCheckPrivileges(req, res, next){
        let reqUrl = req.originalUrl;
        if(reqUrl=="/users/login"){
          next();
          return false;
        }
        (async function(req,reqUrl){
          //首先从请求对象中取出当前登录用户的id,id实际是保存在加密的token中
          let userId = req.auth._id;
          let userObj = await user.findOne({
              where:{id:userId},
              attributes:["roleId"]
          });
          //获取与当前登录用户id关联的角色id
          let roleId = JSON.parse(JSON.stringify(userObj)).roleId;
      
          let menuObj = await menu.findOne({
            where:{menupath:'/users/listusers'},
            attributes:["id"]
          });
          menuObj = JSON.parse(JSON.stringify(menuObj));
          if(!menuObj){
            next(createError("访问路径没有登记"));
            return false;
          }
          
          let menuId = menuObj.id;
      
          let rmObj = await roleAndMenu.findOne({
            where:{
              menuid:menuId,
              roleid:roleId
            }
          })
          rmObj = JSON.parse(JSON.stringify(rmObj));
          console.log(typeof rmObj)
          if(!rmObj){
            //如果没有权限，返回错误信息，不再往下执行逻辑
            //还有一个要考虑的就是超级管理员的话，不需要任何权限判断
            next(createError("menu not found"));
            return false;
          }
        })(req,reqUrl);
        //不写next，后面的app.use都不能执行
        //next();
    }
}