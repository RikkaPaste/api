const db = require("../models/index");
const clients = db.sequelize.import("../models/clients");
const crypto = require("crypto");
const {Op} = require('sequelize');
const jwtCreator = require("jsonwebtoken");
let saltKey="H007";
module.exports={
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let clientname=req.body.clientname;
        let data = await clients.findAndCountAll({
            where:{clientname:{[Op.like]:'%'+clientname+'%'}},
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
            req.body.clientpwd = crypto.createHmac('sha256',saltKey)
        .update("888888")
        .digest('base64');
            addResult = await clients.create(req.body);
            //微信注册时没有用户名，自动生成一个
            if(!req.body.clientname&&addResult.id){
                await clients.update({clientname:"czjp"+addResult.id},
                {where:{id:addResult.id}});
            }
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
        let data = await clients.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"查询用户成功"});
        return false;
    },
    upd: async function(req,res,next){
        
        //返回的是受影响的行数，如:[1]
        let data = await clients.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"修改用户成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await clients.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除用户成功"});
        return false;
    },
    loginByOpenid: async function(req,res,next){
        console.log(req.body)
        let userdata = await clients.findAll(
            {where:{wxopenid:req.body.openid}});
        userdata = JSON.parse(JSON.stringify(userdata));
        
        //返回的是一个空数组，说明没有查询到记录
        if(userdata.length>0){
            let jwtToken = jwtCreator.sign({
            _id:userdata[0].id
            },saltKey,{
            expiresIn: 60000000
            });
            res.json({"code":200,
            data:{"token":jwtToken,"id":userdata[0].id,"name":userdata[0].clientNick},
            "msg":"登录成功"});
        }
        else{
            res.json({"code":500,"msg":"登录失败"});
        }
        return false;
    }
}