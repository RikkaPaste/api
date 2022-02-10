/**
*封装的工具类（可以直接copy使用）
*
*/
let wxConfig = require('../tools/wxconfig.js');
const request = require('request')
const CryptoJS = require('crypto-js')
const Base64 = require('js-base64')
const { resolve } = require('path')
class WechatUtil {
    constructor() {
        this.reqUrl = "https://api.weixin.qq.com/sns/jscode2session"
        this.appid = wxConfig.appid
        this.secret = wxConfig.appsecret
        this.grant_type = "authorization_code"
        this.openId = null
        this.sessionKey = null
    }
    getOpenId(){
        return this.openId
    }
    getSessionKey(){
       return this.sessionKey
    }
    // 获取 sessionKey openid 
    getSessionKeyOropenid(code) {
        return new Promise((resolve, reject) => {
            let url = `${this.reqUrl}?appid=${this.appid}&secret=${this.secret}&js_code=${code}&grant_type=${this.grant_type}`
            request.post(url, {}, (error, res, body) => {
                if (error) {
                    console.error(error)
                    reject(error)
                }
                if(res.statusCode == 200){
                    let jsonBody = JSON.parse(body)
                    this.openId = jsonBody.openId
                    this.sessionKey = jsonBody.session_key
                    resolve(this.sessionKey)
                }
            })
        })
    }
    // 解密获取用户信息
    getWechatUserInfo(encryptedData, ivv, sessionKey) {
        if(!sessionKey){
            sessionKey = this.sessionKey
        }
        let key = CryptoJS.enc.Base64.parse(sessionKey)
        let iv = CryptoJS.enc.Base64.parse(ivv)
        let decrypt = CryptoJS.AES.decrypt(encryptedData, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
        return JSON.parse(Base64.decode(CryptoJS.enc.Base64.stringify(decrypt)))
    }
}

module.exports = WechatUtil
