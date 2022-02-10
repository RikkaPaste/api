const db = require("../models/index");
const roles = db.sequelize.import("../models/roles");
const rolesAndMenu = db.sequelize.import("../models/rolesandmenu");
const menu = db.sequelize.import("../models/menu");
const {Op} = require("sequelize")
module.exports={
    listAll:async function(req,res,next){
        let data = await roles.findAll(
            {where:{roleName:{[Op.ne]:'超级管理员'}}}
        );
        res.json({"code":200,"data":data,"msg":"查询所有角色成功"});
        return false;
    },
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let allRole = await roles.findAndCountAll({
            where:{id:{[Op.ne]:1}},
            order:[['id','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            raw:false
        });
        allRole = JSON.parse(JSON.stringify(allRole));
        for(let k = 0;k<allRole.rows.length;k++){
            //查询每个角色对应的权限
            let data = await rolesAndMenu.findAll({where:{roleid:allRole.rows[k].id}});
            let topMenu = [];
            if(data&&data.length>0){
                let menuids=[];
                //从结果集把所有menuid拿出来组成一个新的一维数组
                for (let index = 0; index < data.length; index++) {
                    menuids.push(data[index].menuid);
                }
                //把menuid数组组装为or的条件语句，查出当前角色id对应的
                //权限表的详细字段信息
                let menus = await menu.findAll({
                    where:{id:{[Op.or]:menuids}}
                })
                menus= JSON.parse(JSON.stringify(menus))
                if(menus&&menus.length>0)
                {
                    //找出所有一级菜单
                    for (let index = 0; index < menus.length; index++) {
                        if(menus[index].parentid==0){
                            topMenu.push(menus[index])
                        }
                    }
                    //找出所有二级菜单并且绑定到对应的一级菜单的children属性上
                    for (let index = 0; index < topMenu.length; index++) {
                        topMenu[index].children=[]
                        for (let j = 0; j < menus.length; j++) {
                            if(topMenu[index].id == menus[j].parentid){
                                topMenu[index].children.push(menus[j])
                            }
                        }
                    }
                }
            }
            //把一级菜单绑定到对应的角色的children属性上
            allRole.rows[k].children = topMenu
        }
        res.json({"code":200,"data":allRole,"msg":"查询角色分页成功"});
        return false;
    },
    add: async function(req,res,next){
        let addResult=null;
        try {
            addResult = await roles.create(req.body);
        } catch (error) {
            console.log(error);
        }
        //执行成功，返回新的数据对象，如果只需要id的话，可以addResult.id
        res.json({"code":200,"data":addResult,"msg":"添加成功"});
        return false;
    },
    findById: async function(req,res,next){
        let paramId = req.body.id;
        //返回的是对象数组，里面只有一个对象
        let data = await roles.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"查询成功"});
        return false;
    },
    upd: async function(req,res,next){
        
        //返回的是受影响的行数，如:[1]
        let data = await roles.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"修改成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await roles.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除成功"});
        return false;
    }
}