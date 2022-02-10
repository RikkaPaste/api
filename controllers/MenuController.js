const db = require("../models/index");
const menu = db.sequelize.import("../models/menu");
const user = db.sequelize.import("../models/users");
const roleAndMenu = db.sequelize.import("../models/rolesandmenu");
const {Op} = require('sequelize');
module.exports={
    listPage: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let menuName = req.body.menuname?req.body.menuname:'';
        let data = await menu.findAndCountAll({
            where:{menuname:{[Op.like]:'%'+menuName+'%'},
        isDel:2},
            order:[['id','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            raw:false
        });
        data = JSON.parse(JSON.stringify(data));
        res.json({"code":200,"data":data,"msg":"查询分页列表成功"});
        return false;
    },
    list: async function(req,res,next){
        /*
        let data = await menu.findAll({where:{parentid:0}});
        data = JSON.parse(JSON.stringify(data));
        for(let i=0;i<data.length;i++)
        {
            let sub = await menu.findAll({where:{parentid:data[i].id}});
            sub = JSON.parse(JSON.stringify(sub));
            data[i]['children'] = sub;
        }*/
        //首先从请求对象中取出当前登录用户的id,id实际是保存在加密的token中
        let userId = req.auth._id;
        let userObj = await user.findOne({
            where:{id:userId},
            attributes:["roleId"]
        });
        //获取与当前登录用户id关联的角色id
        let roleId = JSON.parse(JSON.stringify(userObj)).roleId;

        let menuIds = await roleAndMenu.findAll({
            where:{roleid:roleId},
            attributes:["menuid"]
        })
        menuIds=JSON.parse(JSON.stringify(menuIds))
        //如果当前用户不是超级管理员，并且角色没有分配权限
        if(roleId!=1 && menuIds.length==0){
            res.json({"code":501,"data":null,"msg":"角色没有分配权限，请联系系统管理员"});
        }

        //把对象数组转换为一维普通数组，作为下一次查询的条件参数
        let newMenuIds = menuIds.map(item=>{
            return item.menuid
        })
        let data = [];
        //如果是超级管理，直接查询所有权限
        if(roleId==1)
        {
            data = await menu.findAll({
                where:{isDel:2}
            })
        }
        else{
            data = await menu.findAll({
                where:{id:{[Op.or]:newMenuIds,
                isDel:2}}
            })
        }
        data = JSON.parse(JSON.stringify(data));

        //只执行一次查询，查询所有可以用的一级菜单和二级菜单
        //let data = await menu.findAll();
        //data = JSON.parse(JSON.stringify(data));
        let levelFirst = [];
        //先把一级菜单挑出来，保存到levelFirst数组中
        for(let i=0;i<data.length;i++){
            if(data[i].parentid==0)
            {
                //给每个一级菜单动态添加一个children属性
                //它是一个数组，用于后面给一级菜单添加所属的
                //二级菜单数组对象
                data[i]['children']=[];
                levelFirst.push(data[i]);
            }
        }
        //把所有二级菜单挑出来
        for(let i=0;i<data.length;i++){
            if(data[i].parentid!=0)
            {
                //循环所有一级菜单，找到当前二级菜单所属的那个
                //一级菜单
                for(let j=0; j<levelFirst.length;j++){
                    if(data[i].parentid==levelFirst[j].id){
                        //把当前的二级菜单添加到所属的一级菜单的
                        //children属性上面
                        levelFirst[j]['children'].push(data[i]);
                    }
                }
            }
        }
        res.json({"code":200,"data":levelFirst,"msg":"查询菜单列表成功"});
        return false;
    },
    add: async function(req,res,next){
        let addResult=null;
        try {
            addResult = await menu.create(req.body);
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
        let data = await menu.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"根据id查询成功"});
        return false;
    },
    findByParentId: async function(req,res,next){
        let _parentId = req.body.parentid;
        //返回的是对象数组，里面只有一个对象
        let data = await menu.findAll({where:{parentid:_parentId}});
        res.json({"code":200,"data":data,"msg":"根据父级id查询成功"});
        return false;
    },
    upd: async function(req,res,next){
        //返回的是受影响的行数，如:[1]
        let data = await menu.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"更新成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await menu.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除成功"});
        return false;
    }
}