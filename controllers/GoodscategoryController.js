const db = require("../models/index");
const goodscategory = db.sequelize.import("../models/goodscategory");
const {Op} = require('sequelize');
module.exports={
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let data = await goodscategory.findAndCountAll({
            order:[['cateSort','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            raw:false
        });
        data = JSON.parse(JSON.stringify(data));
        res.json({"code":200,"data":data,"msg":"查询列表成功"});
        return false;
    },
    getLevel: async function(req,res,next){
        let pid = req.body.pid;
        let data = await goodscategory.findAll({where:{catePid:pid},
        order:[['cateSort','desc']]});
        res.json({"code":200,"data":data,"msg":"查询级别分类成功"});
        return false;
    },
    getHasChildren: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let cateName = req.body.cateName;
        let data = await goodscategory.findAndCountAll({
            where:{
                catePid:0,
                cateName:{[Op.like]:'%'+cateName+'%'}
            },
            order:[['cateSort','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            raw:false
        });
        let topCate = [];
        data = JSON.parse(JSON.stringify(data));
        if(data&&data.rows.length>0)
        {
            topCate = data.rows;
            
            let topCateIds = [];
            for (let i = 0; i < topCate.length; i++) {
                topCateIds.push(topCate[i].id);
            }
            let secondCateData = await goodscategory.findAll({
                where:{catePid:{[Op.or]:topCateIds}}
            });
            secondCateData = JSON.parse(JSON.stringify(secondCateData));
            for (let i = 0; i < topCate.length; i++) {
                topCate[i].children=[];
                for (let j = 0; j < secondCateData.length; j++) {
                    if(secondCateData[j].catePid == topCate[i].id){
                        topCate[i].children.push(secondCateData[j]);
                    }
                }
            }
            let secondCateIds = [];
            for (let i = 0; i < secondCateData.length; i++) {
                secondCateIds.push(secondCateData[i].id);
            }
            let thirdCateData = await goodscategory.findAll({
                where:{catePid:{[Op.or]:secondCateIds}}
            });
            thirdCateData = JSON.parse(JSON.stringify(thirdCateData));
            for (let i = 0; i < topCate.length; i++) {
                for(let k = 0; k < topCate[i].children.length; k++) {
                    topCate[i].children[k].children=[];
                    for (let j = 0; j < thirdCateData.length; j++) {
                        if(thirdCateData[j].catePid == topCate[i].children[k].id){
                            topCate[i].children[k].children.push(thirdCateData[j]);
                        }
                    }
                }
            }
        }
        data.rows = topCate;
        res.json({"code":200,"data":data,"msg":"查询级别分类成功"});
        topCate=null;
        thirdCateData=null;
        secondCateData=null;
        return false;
    },
    add: async function(req,res,next){
        let addResult=null;
        try {
            addResult = await goodscategory.create(req.body);
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
        let data = await goodscategory.findAll({where:{id:paramId}});
        res.json({"code":200,"data":data,"msg":"查询成功"});
        return false;
    },
    upd: async function(req,res,next){
        
        //返回的是受影响的行数，如:[1]
        let data = await goodscategory.update(req.body,{where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"修改成功"});
        return false;
    },
    del: async function(req,res,next){
        let data = await goodscategory.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除成功"});
        return false;
    }
}