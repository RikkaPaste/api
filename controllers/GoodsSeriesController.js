const db = require("../models/index");
const goodsSeries = db.sequelize.import("../models/goodsseries");
const {Op} = require('sequelize')
module.exports={
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let data = await goodsSeries.findAndCountAll({
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
        try {
            addResult = await goodsSeries.create(req.body);
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
        let data = await goodsSeries.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"查询成功"});
        return false;
    },
    findByName: async function(req,res,next){
        let seriesName = req.body.series_name;
        //返回的是对象数组，里面只有一个对象
        let data = await goodsSeries.findAll({where:{
            series_name:{[Op.like]:'%'+seriesName+'%'}
        }});
        res.json({"code":200,"data":data,"msg":"查询成功"});
        return false;
    },
    upd: async function(req,res,next){
        
        //返回的是受影响的行数，如:[1]
        let data = await goodsSeries.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"修改成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await goodsSeries.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除成功"});
        return false;
    }
}