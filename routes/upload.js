var express = require('express');
var router = express.Router();
var formidable = require('formidable');
const images = require("images");
const fs=require('fs');
let path = require('path');
/* GET home page. */
router.post('/image', async function(req, res, next) {
    let form = formidable({ multiples: true });
    let newWidth=600;
    let newHeight=600;
    form.encoding = 'utf-8'; // 编码
    // 保留扩展名
    form.keepExtensions = true;

    //文件存储路径 最后要注意加 '/' 否则会被存在public下
    form.uploadDir = path.join(__dirname, '../public/images/upload/');
    // 解析 formData 数据
    form.parse(req, (err, fields ,files) => {
      let folder = fields.folder||"";
      let isResize=fields.isResize||1;//1.需要resize 2.不需要resize
      let onlyWidth=fields.onlyWidth||2;//1.只按宽度缩放 2.不用
      if(err) return next(err)
      let imgPath = files.file.path;//上传后新生成图片的完整路径
      let imgName = files.file.name;//原始文件名
      let pathArr = imgPath.split("upload"+path.sep);//分隔符兼容不同系统
      let pathArr2 = imgPath.split("upload"+path.sep);
      
      let newFolderPath=path.join(pathArr2[0],"upload/"+folder);
      if(!fs.existsSync(newFolderPath)){
        fs.mkdirSync(newFolderPath,{recursive:true});
      }
      let newImgPath=path.join(newFolderPath,pathArr2[1]);
      let imgObj=images(imgPath);
      if(isResize==1){
        //如果宽超过600，把宽缩为600，高度等比例跟着缩
        if(imgObj.width()>newWidth&&imgObj.height()<=newHeight){
          imgObj.resize(newWidth).save(newImgPath);
        }
        else if(imgObj.width()>newWidth&&imgObj.height()>newHeight){
          //先按宽度等比缩放
          imgObj.resize(newWidth).save(newImgPath);
          //再把高度裁剪为指定高度
          images(images(newImgPath),0,0,newWidth,newHeight).save(newImgPath);
        }
        else{
          //如果高度和宽度都没有超出指定尺寸，就直接保存
          imgObj.save(newImgPath);
        }
      }
      else if(onlyWidth==1){//配合富文本编辑器，不处理高度，只做等宽缩放
        imgObj.resize(newWidth).save(newImgPath);
      }
      else{
        //如果不要缩放，直接把图片放到指定目录去
        imgObj.save(newImgPath);
      }
      //删除原有图片
      fs.unlinkSync(imgPath);
      //imgPath = pathArr[pathArr.length-2]+"/"+pathArr[pathArr.length-1];
      
      // 返回路径和文件名
      //res.json({code: 1, data: { name: imgName, path: imgPath }});
      res.json({"code":200,"data":{ name: imgName, path: pathArr[pathArr.length-1] },"msg":"上传图片成功"});
    })
});

module.exports = router;