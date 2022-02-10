//安装发送邮件模块: cnpm i -S nodemailer
let nodemailer = require("nodemailer");
const db = require("../models/index");
const user = db.sequelize.import("../models/users");
const crypto = require("crypto");
let transporter = nodemailer.createTransport({
    service:'qq',//类型是qq邮箱
    port:465,
    secure:true,
    auth:{
        user:'33590896@qq.com',//发送方邮箱
        pass:'yzxspwldwjxubgbh'//授权码
    }
});
function sendEmail(mail,code,call){
    let options={
        from:"零七购<33590896@qq.com>", //发送方说明
        to:mail, //接收方邮箱
        subject:'重置后台管理登录密码',
        text:'重置后台管理登录密码',
        html:"<h2>零七购后台管理系统登录密码重置为<font color='red'>"+code+"</font>,建议立刻登录系统修改密码保证安全！</h2>"
    }
    transporter.sendMail(options,(error,info)=>{
        if(error){
            call(false,info);
        }
        else{
            call(true,info);
        }
    });
}
module.exports = {
    send:async function(req,res,next){
        let email = req.body.email||"";
        if(!email){
            res.json({"code":500,"data":null,"msg":"邮箱地址不能为空"});
            return false;
        }
        //检查邮箱地址在数据库表中是否存在
        let userObj = await user.findOne({
            where:{email}
        });
        if(!userObj||!userObj.id){
            res.json({"code":500,"data":null,"msg":"非法的邮箱地址"});
            return false;
        }
        let saltKey= "H007";
        //密码需要加密之后再保存到数据库
        let passwd = crypto.createHmac('sha256',saltKey)
        .update("666666")
        .digest('base64');
        //把对应用户的密码重置为666666
        await user.update({passwd},{
            where:{email}
        });
        sendEmail(email,"666666",(state,info)=>{
            if(state){
                res.json({"code":200,"data":null,"msg":"发送邮件成功"});
                return false;
            }
            else{
                res.json({"code":500,"data":null,"msg":"发送邮件失败,"+info});
                return false;
            }
        });
        console.log("发送邮件");
    }
}