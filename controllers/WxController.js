let axios = require("axios");
const db = require("../models/index");
const { Op } = require('sequelize');
const clients = db.sequelize.import("../models/clients");
const order = db.sequelize.import("../models/order");
const ordergoods = db.sequelize.import("../models/ordergoods");
var xmlreader = require("xmlreader");
var wxpay = require('../tools/wxutil.js');
let wxConfig = require('../tools/wxconfig.js');
let appid = wxConfig.appid;
let appsecret = wxConfig.appsecret;
var mchid = wxConfig.mchid; // 微信商户号
var mchkey = wxConfig.mchkey;  // 微信商户的key 32位
var wxurl = wxConfig.paynotifyurl; //通知地址
const dayjs = require('dayjs');
//json转xml
var json2Xml = function (json) {
	let _xml = '';
	Object.keys(json).map((key) => {
		_xml += `<${key}>${json[key]}</${key}>`
	})
	return `<xml>${_xml}</xml>`;
}
module.exports = {
	payBack: async function (req, res, next) {
		var jsonData = req.body.xml;
		if(jsonData.result_code == 'SUCCESS'){
			//返回的是下面的数据类型
			// {
			// 	appid: 'wxc447337d9b6cc943',
			// 	bank_type: 'OTHERS',
			// 	cash_fee: '1',
			// 	fee_type: 'CNY',
			// 	is_subscribe: 'N',
			// 	mch_id: '1606430110',
			// 	nonce_str: '9d8856iwa3c',
			// 	openid: 'ok9z-4uADMCvQN-QN5lGDtLMvNXw',
			// 	out_trade_no: '2021031523445445',
			// 	result_code: 'SUCCESS',
			// 	return_code: 'SUCCESS',
			// 	sign: '0F428FAB755C34EEC3C1B7C00CCDAC48',
			// 	time_end: '20210315234458',
			// 	total_fee: '1',
			// 	trade_type: 'JSAPI',
			// 	transaction_id: '4200000934202103152459164215'
			//   }
			console.log(jsonData);
			await order.update({tradeNo:jsonData.transaction_id,payStatus:1},
				{where:{orderNumber:jsonData.out_trade_no}});
			var sendData = {
				return_code: 'SUCCESS',
				return_msg: 'OK'
			}
			//响应成功的消息给微信服务器，微信服务器就不会再重复发数据过来了
			res.end(json2Xml(sendData));
		}
	},
	getPrepayId: async function (req, res, next) {
		//首先拿到前端传过来的参数
		//let orderCode = req.body.orderCode;
		let money = req.body.totalPrice;
		let goodsList = req.body.goodsList;
		//let orderID = req.body.orderID;
		let openid = req.body.openid;
		let fromOpenId=req.body.fromOpenId?req.body.fromOpenId:'';
		let totalNum = req.body.totalNum;
		let addr = req.body.addr;
		let clientId = null;
		if (openid) {
			let clientObj = await clients.findOne({ where: { wxopenid: openid } });
			clientId = clientObj.id;
		}
		/*
		console.log('APP传过来的参数是', 
		+ money + '------' 
		//+ orderID + '----' 
		+ appid + '-----' 
		+ appsecret + '-----' 
		+ mchid + '-----' 
		+ mchkey);*/

		let t = await db.sequelize.transaction();
		let orderNumber = null;
		let orderId = null;
		try {
			let orderRs = await order.create({
				clientId,
				orderNumber: totalNum,
				orderPrice: money,
				orderPay: 2,//支付类型，2：微信
				consigneeName: addr.userName,
				consigneePhone: addr.telNumber,
				consigneeAddr: addr.consignee_addr,
				openId:openid,
				fromOpenId
			}, { transaction: t });
			orderId = orderRs.id;
			orderNumber = dayjs().format('YYYYMMDDHHmmss') + orderId;
			await order.update({ orderNumber },
				{ where: { id: orderId }, transaction: t });

			goodsList.forEach((ele, i) => {
				ele.orderId = orderId;
			});
			await ordergoods.bulkCreate(goodsList, { transaction: t });
			await t.commit();
		} catch (error) {
			console.log(error);
			await t.rollback();
		}
		//首先生成签名sign
		// appid
		let mch_id = mchid;
		let nonce_str = wxpay.createNonceStr();
		let timestamp = wxpay.createTimeStamp();
		let body = '茶斟君品购买商品使用微信支付';
		let out_trade_no = orderNumber;
		let total_fee = wxpay.getmoney(money);
		let spbill_create_ip = req.connection.remoteAddress; // 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
		let notify_url = wxurl;
		let trade_type = 'JSAPI';  // 'APP';公众号：'JSAPI'或'NATIVE'

		let sign = wxpay.paysignjsapi(appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey);

		//console.log('sign==', sign);

		//组装xml数据
		var formData = "<xml>";
		formData += "<appid>" + appid + "</appid>";  //appid
		formData += "<body><![CDATA[" + "茶斟君品购买商品使用微信支付" + "]]></body>";
		formData += "<mch_id>" + mch_id + "</mch_id>";  //商户号
		formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
		formData += "<notify_url>" + notify_url + "</notify_url>";
		formData += "<openid>" + openid + "</openid>";
		formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
		formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
		formData += "<total_fee>" + total_fee + "</total_fee>";
		formData += "<trade_type>" + trade_type + "</trade_type>";
		formData += "<sign>" + sign + "</sign>";
		formData += "</xml>";

		//console.log('formData===', formData);

		var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';

		try {
			let { status, data } = await axios.post(url, formData);
			if (status == 200) {
				xmlreader.read(data.toString("utf-8"), function (errors, response) {
					console.log(data,150);
					if (null !== errors) {
						console.log(errors)
						return;
					}
					//console.log('长度===', response.xml.prepay_id.text().length);
					var prepay_id = response.xml.prepay_id.text();
					//console.log('解析后的prepay_id==', prepay_id);

					//将预支付订单和其他信息一起签名后返回给前端
					let package = "prepay_id=" + prepay_id;
					let signType = "MD5";
					let minisign = wxpay.paysignjsapimini(appid, nonce_str, package, signType, timestamp, mchkey);
					res.end(JSON.stringify({
						code: '200', msg: '获取prepay_id成功',
						data: {
							'appId': appid, 'partnerId': mchid,
							'prepayId': prepay_id, 'nonceStr': nonce_str,
							'timeStamp': timestamp, 'package': 'Sign=WXPay',
							'paySign': minisign
						}
					}));
				});
				return false;
			}
		} catch (error) {
			console.log(error);
		}
		res.json({ code: 500, msg: "获取prepay_id失败" });
		return false;
	},
	getOpenid: async function (req, res, next) {
		let code = req.body.code;
		if (code) {
			let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`;
			let rs = await axios.get(url);
			console.log(rs.data);
			if(rs.data.errcode&&rs.data.errmsg){
				res.json({ "code": 500, "data": null, "msg": rs.data });
				return false;
			}
			if (rs.status == 200 && rs.data) {
				/*
				{
					session_key: 'MRMQbL4/GGk4gqgOQ7yO/w==',
					openid: 'ok9z-4uADMCvQN-QN5lGDtLMvNXw'
				}*/
				let client = await clients.findOne({ where: { wxopenid: rs.data.openid } });
				if (client) {
					rs.data.isReg = 1;//已注册
					if(client.clientNick){
						rs.data.isNick = 1;//已有昵称
					}
					else{
						rs.data.isNick = 2;//无昵称
					}
					rs.data.clientNick=client.clientNick;
					rs.data.clientId=client.id;
				}
				else {
					rs.data.isReg = 2;//未注册
					rs.data.isNick = 2;
				}
				
				res.json({ "code": 200, "data": rs.data, "msg": "获取openid成功" });
				return false;
			}
		}
		res.json({ "code": 500, "data": null, "msg": "缺少code" });
		return false;
	}

}