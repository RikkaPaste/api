const db = require("../models/index");
const order = db.sequelize.import("../models/order");
const orderGoods = db.sequelize.import("../models/ordergoods");
const clients = db.sequelize.import("../models/clients");
const {Op} = require("sequelize");
const {formatTime} = require("../tools/util.js");
module.exports={
    getCount:async function(req,res,next){
        let openid=req.body.openid;
        let where={};
        let clientId=0;
        if(openid){
            let clientObj=await clients.findOne({where:{wxopenid:openid}});
            clientId=clientObj.id;
        }
        let daiFaHuoCount=0;
        let yiFaHuoCount=0;
        let cancelCount=0;
        //如果查询的是某个客户的订单加上这个条件
        //不加就查询全部记录
        if(openid){
            where.clientId=clientId;
            //待发货数量
            daiFaHuoCount = 
            await order.count({where:{[Op.and]:[{isSend:2},{isCancel:2},{clientId},
            {payStatus:1}]}});
            //已发货数量
            yiFaHuoCount = 
            await order.count({where:{[Op.and]:[{isSend:1},{clientId},{payStatus:1}]}});
            //取消或申请取消的数量
            cancelCount=
            await order.count({where:{
                [Op.and]:[
                    {[Op.or]:[{isCancel:1},{isCancel:3}]},
                    {clientId,payStatus:1}]
                }
            });
        }
        else{
            //待发货数量
            daiFaHuoCount = 
            await order.count({where:{[Op.and]:[{isSend:2},{isCancel:2},{payStatus:1}]}});
            //已发货数量
            yiFaHuoCount = 
            await order.count({where:{isSend:1,payStatus:1}});
            //取消或申请取消的数量
            cancelCount=
            await order.count({where:{
                [Op.and]:[
                    {[Op.or]:[{isCancel:1},{isCancel:3}]},
                    {payStatus:1}
                ]
            }});
        }
        
        
        res.json({"code":200,"data":{
            daiFaHuoCount,yiFaHuoCount,cancelCount
        },"msg":"查询订单各种数量成功"});
        return false;
    },
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        let isSend = req.body.isSend;//是否发货
        let isCancel=req.body.isCancel;//申请取消或已取消
        
        let openid=req.body.openid;
        let clientId=0;
        let orderNumber=req.body.order_number;
        if(openid){
            let clientObj=await clients.findOne({where:{wxopenid:openid}});
            clientId=clientObj.id;
        }
        let where={payStatus:1};
        if(isSend==2){
            where={[Op.and]:[{isSend:2},{isCancel:2},{payStatus:1}]};//未发货
        }
        else if(isSend==1){
            where={isSend:1,payStatus:1};//已发货
        }
        else if(isCancel==1){
            where={
                [Op.and]:[
                    {[Op.or]:[{isCancel:1},{isCancel:3}]},
                    {payStatus:1}
                ]
            };//已取消或申请取消
        }
        console.log(where);
        if(orderNumber){
            where.orderNumber={[Op.like]:'%'+orderNumber+'%'};
        }
        // else{
        //     where={id:{[Op.gt]:0}};
        // }
        if(openid){
            where.clientId=clientId;
        }
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let data = await order.findAndCountAll({
            where,
            order:[['id','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            raw:false
        });
        data = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < data.rows.length; i++) {
            let orderGooodsList=await orderGoods.findAll(
                {where:{orderId:data.rows[i].id}});
                data.rows[i].goodsList=orderGooodsList;
                data.rows[i].createdAt=formatTime(new Date(data.rows[i].createdAt));
                data.rows[i].updatedAt=formatTime(new Date(data.rows[i].updatedAt));
        }
        res.json({"code":200,"data":data,"msg":"查询列表成功"});
        return false;
    },
    add: async function(req,res,next){
        let addResult=null;
        try {
            addResult = await order.create(req.body);
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
        let data = await order.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"查询成功"});
        return false;
    },
    upd: async function(req,res,next){
        
        //返回的是受影响的行数，如:[1]
        let data = await order.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"修改成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await order.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除成功"});
        return false;
    }
}