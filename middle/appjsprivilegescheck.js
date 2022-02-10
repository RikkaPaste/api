const db = require("../models/index");
const menu = db.sequelize.import("../models/menu");
const user = db.sequelize.import("../models/users");
const roleAndMenu = db.sequelize.import("../models/roles_and_menu");
const {Op} = require('sequelize');
module.exports={
    checkPrivileges(req, res, next) {
        let reqUrl = req.originalUrl;
        //把请求地址按照/拆分获得数组
        let urlArr= reqUrl.split("/");
        //取最后一个元素的，前面三个字母
        let urlPre = urlArr[2].substring(0,3);
        //增删改以外的路径不需要检查权限
        if(urlPre!="add"&&urlPre!="del"&&urlPre!="upd"){
          next();
          return false;
        }
        (async function(req,reqUrl){
          //首先从请求对象中取出当前登录用户的id,id实际是保存在加密的token中
          let userId = req.auth._id;
          //如果当前登录的是超级管理员，那么直接跳过检查
          if(userId==1){
            next();
            return false;
          }
          let userObj = await user.findOne({
              where:{id:userId},
              attributes:["roleId"]
          });
          //获取与当前登录用户id关联的角色id
          let roleId = JSON.parse(JSON.stringify(userObj)).roleId;
      
          let menuObj = await menu.findOne({
            where:{menupath: reqUrl},
            attributes:["id"]
          });
          menuObj = JSON.parse(JSON.stringify(menuObj));
          //如果路径在api项目的routes里面已经配置了，但是
          //在数据库中没有记录，那么也要提示
          if(!menuObj){
            //next(createError("menu path is not record"));
            res.send({code:503,msg:"menu path is not record"});
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
            res.send({code:506,msg:"path: "+reqUrl+",no privileges"});
            return false;
          }
        })(req,reqUrl);
        //不写next，后面的app.use都不能执行
        //next();
    }
}