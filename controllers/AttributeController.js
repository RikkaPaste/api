const db = require("../models/index");
const attribute = db.sequelize.import("../models/attribute");
module.exports={
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let data = await attribute.findAndCountAll({
            order:[['id','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            raw:false
        });
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        res.json({"code":200,"data":data,"msg":"查询用户列表成功"});
        return false;
    },
    add: async function(req,res,next){
        let addResult=null;
        try {
            addResult = await attribute.create(req.body);
        } catch (error) {
            console.log(error);
        }
        //执行成功，返回新的数据对象，如果只需要id的话，可以addResult.id
        res.json({"code":200,"data":addResult,"msg":"添加用户成功"});
        return false;
    },
    findById: async function(req,res,next){
        let paramId = req.body.id;
        //返回的是对象数组，里面只有一个对象
        let data = await attribute.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"查询用户成功"});
        return false;
    },
    findByCateIdAndSel: async function(req,res,next){
        let cateId = req.body.catId;
        let attrSel = req.body.attrSel;
        //返回的是对象数组，里面只有一个对象
        let data = await attribute.findAll({where:{catId:cateId,attrSel:attrSel}});
        res.json({"code":200,"data":data,"msg":"根据分类id和参数属性类别查询成功"});
        return false;
    },
    upd: async function(req,res,next){
        
        //返回的是受影响的行数，如:[1]
        let data = await attribute.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"修改用户成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await attribute.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除用户成功"});
        return false;
    }
}