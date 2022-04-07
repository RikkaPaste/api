const db = require("../models/index");
const rolesAndMenu = db.sequelize.import("../models/rolesandmenu");
const menu = db.sequelize.import("../models/menu");
const {Op} = require("sequelize")
module.exports={
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let data = await rolesAndMenu.findAndCountAll({
            order:[['id','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            raw:false
        });
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        res.json({"code":200,"data":data,"msg":"查询列表成功"});
        return false;
    },
    add: async function(req,res,next){
        let addResult=null;
        let roleId = req.body.roleid;
        let ids = req.body.idstr;
        if(ids&&roleId){
            //传递的menuid是以下划线分隔的格式:idstr: "11_12_13_14"
            let idArr = ids.split("_")
            if(idArr.length>0){
                let oldPri = await rolesAndMenu.findAll({
                    where:{
                        [Op.and]:[
                            {menuid:{[Op.or]:idArr}},
                            {roleid:roleId}
                        ]
                    }
                })
                oldPri = JSON.parse(JSON.stringify(oldPri))
                
                let newObjArr = []
                for(let i=0;i<idArr.length;i++){
                    newObjArr.push({roleid:roleId,menuid:idArr[i]})
                }
                let transaction=null;
                (async ()=>{
                    try {
                        transaction = await db.sequelize.transaction();
                        await rolesAndMenu.destroy({
                        where:{roleid:roleId}
                        ,transaction})
                        await rolesAndMenu.bulkCreate(newObjArr,{transaction})
                        await transaction.commit();
                    } catch (error) {
                        console.log(error);
                        await transaction.rollback();
                        res.json({"code":500,"data":null,"msg":"分配权限失败,"+error});
                    }
                })()
            }
        }
        res.json({"code":200,"data":null,"msg":"添加成功"});
        return false;
    },
    findById: async function(req,res,next){
        let paramId = req.body.id;
        //返回的是对象数组，里面只有一个对象
        let data = await rolesAndMenu.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"查询成功"});
        return false;
    },
    findByRoleId: async function(req,res,next){
        let roleId = req.body.roleid;
        //返回的是对象数组，里面只有一个对象
        let data = await rolesAndMenu.findAll({where:{roleid:roleId}});
        let topMenu = [];
        if(data&&data.length>0){
            let menuids=[];
            for (let index = 0; index < data.length; index++) {
                menuids.push(data[index].menuid);
            }
            let menus = await menu.findAll({
                where:{id:{[Op.or]:menuids}}
            })
            menus= JSON.parse(JSON.stringify(menus))
            if(menus&&menus.length>0)
            {
                
                for (let index = 0; index < menus.length; index++) {
                    if(menus[index].parentid==0){
                        topMenu.push(menus[index])
                    }
                }
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
        res.json({"code":200,"data":topMenu,"msg":"查询成功"});
        return false;
    },
    upd: async function(req,res,next){
        
        //返回的是受影响的行数，如:[1]
        let data = await rolesAndMenu.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"修改成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await rolesAndMenu.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除成功"});
        return false;
    }
}