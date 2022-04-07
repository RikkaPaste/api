const axios = require('axios')
const md5Hex = require('md5-hex');
const querystring = require('querystring');
//请求url --正式地址
const url = 'https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx';
//电商加密私钥，快递鸟提供，注意保管，不要泄漏 
const AppKey = '6cc4c387-d4ba-4a6e-9e18-ec5fbf0c27b3';//请登陆快递鸟用户管理后台查看：http://kdniao.com/UserCenter/UserHome.aspx
//电商ID 
const EBusinessID = '1701278'; //请登陆快递鸟用户管理后台查看：http://kdniao.com/UserCenter/UserHome.aspx
module.exports={
	async find(req,res,next){
		let expressNo=req.body.expressNo;
		if(!expressNo){
			res.json({code:500,msg:"缺少运单号",data:null});
			return false;
		}
		let expressCompany=req.body.expressCompany;
		if(!expressCompany){
			res.json({code:500,msg:"缺少快递公司信息",data:null});
			return false;
		}
		let companyArr=expressCompany.split("|");
		let companyName=companyArr[0];
		let companyNo=companyArr[1];
		let data=getParams(expressNo,companyNo);
		axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		const rs = await axios.post(url,querystring.stringify(data))
		res.json({code:200,msg:"查询完毕",data:rs.data});
	}
}
function getParams(expressNo,companyNo){
    //请求接口指令
    const RequestType  = '1002';
    const RequestData = {'OrderCode': '','ShipperCode': companyNo, 'LogisticCode': expressNo}
    const DataSign = Buffer.from(md5Hex(JSON.stringify(RequestData)+AppKey)).toString('base64')
    const reqParams = {
        RequestType,
        EBusinessID,
        DataSign,
        RequestData:JSON.stringify(RequestData),
        DataType:2
    }
    return reqParams
}//请求参数