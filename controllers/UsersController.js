const db = require("../models/index");
const user = db.sequelize.import("../models/users");
const role = db.sequelize.import('../models/roles');
const crypto = require("crypto");
const jwtCreator = require("jsonwebtoken");
const {Op} = require('sequelize');
let saltKey="H007";
module.exports={
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        //建立roles和users表的关联关系
        user.belongsTo(role);
        role.hasMany(user);
        let username = req.body.username?req.body.username:"";
        let email = req.body.email?req.body.email:"";
        let data = await user.findAndCountAll({
            where:{
                email:{[Op.like]:'%'+email+'%'},
                username:{[Op.like]:'%'+username+'%'}
            },
            order:[['id','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            include:[{
                model:role,
                //设置多表查询的别名,如果不设置，默认使用model名称
                //建议不设置别名
                //as:'r',
                //需要主表的哪个字段，并且设置字段别名
                attributes:[['roleName','rname']]
            }],
            raw:false
        });
        data = JSON.parse(JSON.stringify(data));
        //roles表的数据挂在users数据对象的下面
        //为了方便页面循环处理，需要把users数据对象中的
        //role对象的rname值取出来，动态设置为users数据对象的一个
        //属性
        for(let i =0;i<data.rows.length;i++){
            data.rows[i]['rname'] = data.rows[i].role.rname;
            data.rows[i].role = null;
            data.rows[i].chkStatus = data.rows[i].chkStatus==1?true:false;
        }
        console.log(data);
        res.json({"code":200,"data":data,"msg":"查询用户列表成功"});
        return false;
    },
    add: async function(req,res,next){
        let addResult=null;
        req.body.passwd = crypto.createHmac('sha256',saltKey)
        .update(req.body.passwd)
        .digest('base64');
        try {
            addResult = await user.create(req.body);
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
        let data = await user.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"查询用户成功"});
        return false;
    },
    upd: async function(req,res,next){
        
        if(req.body.passwd){
            req.body.passwd = crypto.createHmac('sha256',saltKey)
            .update(req.body.passwd).digest('base64');
        }
        //返回的是受影响的行数，如:[1]
        let data = await user.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"修改用户成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await user.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除用户成功"});
        return false;
    },
    login: async function(req,res,next){
        console.log(req.body)
        req.body.passwd = crypto.createHmac('sha256',saltKey)
        .update(req.body.passwd)
        .digest('base64');
        let userdata = await user.findAll({where:{username:req.body.username,
            passwd:req.body.passwd}});
        userdata = JSON.parse(JSON.stringify(userdata));
        
        //返回的是一个空数组，说明没有查询到记录
        if(userdata.length>0){
            let jwtToken = jwtCreator.sign({
            _id:userdata[0].id
            },saltKey,{
            expiresIn: 60000000
            });
            res.json({"code":200,
            data:{"token":jwtToken,"id":userdata[0].id,"name":userdata[0].username},
            "msg":"登录成功"});
        }
        else{
            res.json({"code":500,"msg":"登录失败"});
        }
        return false;
    }
}