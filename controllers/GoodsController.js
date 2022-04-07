const db = require("../models/index");
const goods = db.sequelize.import("../models/goods");
const goodsSeries = db.sequelize.import("../models/goodsseries");
const goodsImg = db.sequelize.import("../models/goodsimg");
const goodsDescModel = db.sequelize.import("../models/goodsdesc");
const md5 = require('md5-node');
const {Op} = require('sequelize');
function arrayGroup(arrs){
    return arrs.reduce((a, b) => {
        const arr = [];
        a.forEach(i => {
            b.forEach(j => {
                arr.push(i + "_" + j);
            });
        });
        return arr;
    });
}
module.exports={
    list: async function(req,res,next){
        //当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let goodsName = req.body.goodsName||"";
        let data = await goods.findAndCountAll({
            where:{goodsName:{[Op.like]:'%'+goodsName+'%'}},
            order:[['id','DESC']],//asc从小到大，desc从大到小
            offset,//当前页之前的所有记录
            limit,//每页记录数
            raw:false
        });
        data = JSON.parse(JSON.stringify(data));
        //console.log(data);
        res.json({"code":200,"data":data,"msg":"查询列表成功"});
        return false;
    },
    finds:async function(req,res,next){
		//当前页数
        let pageNo = req.body.pageNo;
        //每页记录数
        let limit = req.body.pageSize;
        //当前页之前的所有记录
        let offset = (pageNo-1)*limit;
        let goodsName = req.body.goodsName||"";
        let data = await goods.findAndCountAll({
            where:{goodsName:{[Op.like]:'%'+goodsName+'%'},chkStatus:1},
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
    findByCateId: async function(req,res,next){
        let paramId = req.body.id;
        //返回的是对象数组，里面只有一个对象
        let data = await goods.findAll({where:{catId:paramId,chkStatus:1}});
        res.json({"code":200,"data":data,"msg":"查询成功"});
        return false;
    },
    add: function(req,res,next){
        console.log(req.body);
        let dynamicParam = req.body.dynamicParam?req.body.dynamicParam:[];
        let staticAttr = req.body.staticAttr?req.body.staticAttr:[];
        let pics = req.body.pics?req.body.pics:[];
        //let goodsSeriesId = req.body.series_id;
        let goodsSeriesId="";
        let goodsDesc = req.body.goodsDesc||'';
        if(goodsDesc){
            goodsDesc=encodeURIComponent(goodsDesc);
        }
        let goodsName = req.body.goodsName;
        let goodsPrice = req.body.goodsPrice;
        let goodsWeight = req.body.goodsWeight;
        let goodsNumber = req.body.goodsNumber;
        let goodsCate = req.body.goodsCate;
        let goodsSmallLogo = req.body.goodsSmallLogo||"";
        let goodsLiLv=req.body.goodsLiLv;
        let arrs=[];
        let transaction=null;
        let addGoodsResult=null;
        if(dynamicParam.length>0){
            for (let i = 0; i < dynamicParam.length; i++) {
                let attrValue = dynamicParam[i].attrValue;
                attrValueArr = attrValue.split("_");
                arrs.push(attrValueArr);
            }
            
            console.log(arrayGroup(arrs));
            (async ()=>{
                transaction = await db.sequelize.transaction();
                
                try {
                    //系列暂不考虑
                    // if(goodsSeriesId){
                    //     let goodsSeriesData={
                    //         dparam_values:JSON.stringify(dynamicParam),
                    //         sattrValues:JSON.stringify(staticAttr)
                    //     };
                    //     //更新商品系列表
                    //     await goodsSeries.update(goodsSeriesData,{where:{id:goodsSeriesId},transaction});
                    // }
                    //图片先按系列id插入，如果以后前台查询到商品本身没有图片，可以使用系列的图片作为默认图片显示
                    /*
                    if(pics.length>0){
                        let picData = [];
                        for(let i =0;i<pics.length;i++){
                            let picObj={
                                midImg:pics[i].path,
                                //series_id:goodsSeriesId,
                                seriesId:0,
                                createStamp:new Date().getTime(),
                                updateStamp:new Date().getTime()
                            }
                            picData.push(picObj);
                        }
                        await goodsImg.bulkCreate(picData,{transaction});
                    }*/
                    
                    //组合商品属性
                    let attrs = arrayGroup(arrs);
                  
                    let goodsData=[];
                    let cateArr = goodsCate.split("_");
                    for(let i=0;i<attrs.length;i++){
                        //使用系列id和属性组合通过md5形成一个唯一的标识
                        //方便移动端详情页选中属性组合时进行查询
                        let seriesFlag = md5(encodeURIComponent(goodsSeriesId+attrs[i]));
                        let attrArr = attrs[i].split("_");
                        let tmpGoodsName = goodsName;
                        //在商品名称后面加上属性组合
                        for(let j=0;j<attrArr.length;j++){
                            tmpGoodsName+=" "+attrArr[j];
                        }
                        let goodsObj={
                            goodsName:tmpGoodsName,
                            goodsPrice,
                            goodsWeight,
                            goodsNumber,
                            seriesFlag,
                            goodsLiLv,
                            catId:cateArr[2],
                            catOneId:cateArr[0],
                            catTwoId:cateArr[1],
                            catThreeId:cateArr[2],
                            goodsSmallLogo:goodsSmallLogo.path,
                            createStamp:new Date().getTime(),
                            updateStamp:new Date().getTime()
                        }
                        goodsData.push(goodsObj);
                    }
                    //添加商品表记录
                    addGoodsResult = await goods.bulkCreate(goodsData,{transaction});
                    if(pics.length>0){
                        let photoAlbum=[];
                        if(addGoodsResult&&addGoodsResult.length>0){
                            for (let i = 0; i < addGoodsResult.length; i++) {
                                for (let j = 0; j < pics.length; j++) {
                                    let picObj={
                                        midImg:pics[j].path,
                                        //series_id:goodsSeriesId,
                                        seriesId:0,
                                        goodsId:addGoodsResult[i].id,
                                        createStamp:new Date().getTime(),
                                        updateStamp:new Date().getTime()
                                    }
                                    photoAlbum.push(picObj);
                                }
                            }
                            await goodsImg.bulkCreate(photoAlbum,{transaction});
                        }
                    }
                    
                    //商品详情默认与系列id关联，如果查询商品本身没有关联详情，可以使用默认的系列详情
                    if(goodsDesc){
                        let descArray=[];
                        for (let i = 0; i < addGoodsResult.length; i++) {
                            let descObj={
                                seriesId:0,
                                goodsId:addGoodsResult[i].id,
                                goodsDesc:goodsDesc,
                                createStamp:new Date().getTime(),
                                updateStamp:new Date().getTime()
                            }
                            descArray.push(descObj);
                        }
                        await goodsDescModel.bulkCreate(descArray,{transaction});
                        // await goodsDescModel.create({
                        //     //seriesId:goodsSeriesId,
                        //     seriesId:0,
                        //     goodsDesc:goodsDesc,
                        //     createStamp:new Date().getTime(),
                        //     updateStamp:new Date().getTime()
                        // },{transaction});
                    }
                    await transaction.commit();
                } catch (error) {
                    console.log(error);
                    await transaction.rollback();
                    res.json({"code":500,"data":null,"msg":"添加失败,"+error});
                    return false;
                }

            })();
        }
        
        //执行成功，返回新的数据对象，如果只需要id的话，可以addResult.id
        res.json({"code":200,"data":addGoodsResult,"msg":"添加成功"});
        return false;
    },
    findById: async function(req,res,next){
        let paramId = req.body.id;
        //返回的是对象数组，里面只有一个对象
        let data = await goods.findOne({where:{id:paramId}});
        if(data!=null){
            data = JSON.parse(JSON.stringify(data));
            let descObj=await goodsDescModel.findOne({where:{goodsId:paramId}});
            if(descObj!=null)
            {data.goodsIntroduce=descObj.goodsDesc||"";}
            let imgs=await goodsImg.findAll({where:{goodsId:paramId}});
            data.pics=imgs;
        }console.log(data);
        res.json({"code":200,"data":data,"msg":"查询成功"});
        return false;
    },
    upd: async function(req,res,next){
        try {
            //返回的是受影响的行数，如:[1]
            let data = await goods.update(req.body,{where:{id:req.body.id}});
            res.json({"code":200,"data":data,"msg":"修改成功"});
        } catch (error) {
            console.log(error);
            res.json({"code":500,"data":null,"msg":error});
        }
        return false;
    },
    del: async function(req,res,next){
        let data = await goods.destroy({where:{id:req.body.id}});
        res.json({"code":200,"data":data,"msg":"删除成功"});
        return false;
    },
    findForLayout:async function(req,res,next){
        let rs=await goods.findAll({
            where:{isLayout:1,chkStatus:1}
        });
        let newData=null;
        if(rs&&rs.length>0){
            rs=JSON.parse(JSON.stringify(rs));
            let newArray=[];
            let lvArr=[];
            let wulongArr=[];
            let yanArr=[];
            let huaArr=[];
            let redArr=[];
            let whiteArr=[];
            let otherArr=[];
            let heiArr=[];
           
            for (let i = 0; i < rs.length; i++) {
                switch (rs[i]['catTwoId']) {
                    case 1483:
                        lvArr.push(rs[i]);
                        break;
                    case 1484:
                        wulongArr.push(rs[i]);
                        break;
                    case 1485:
                        yanArr.push(rs[i]);
                        break;
                    case 1486:
                        huaArr.push(rs[i]);
                        break;
                    case 1487:
                        redArr.push(rs[i]);
                        break;
                    case 1488:
                        whiteArr.push(rs[i]);
                        break;
                    case 1489:
                        otherArr.push(rs[i]);
                        break;
                    case 1505:
                        heiArr.push(rs[i]);
                        break;
                    default:
                        break;
                }
                
            }
            newData={
                "lv":lvArr,
                "wulong":wulongArr,
                "yan":yanArr,
                "hua":huaArr,
                "red":redArr,
                "white":whiteArr,
                "other":otherArr,
                "hei":heiArr
            };
        }
        res.json({"code":200,"data":newData,"msg":"查询成功"});
        return false;
    }
}