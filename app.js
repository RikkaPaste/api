var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressJwt = require("express-jwt");
bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var app = express();
app.use(bodyParser.xml({
  limit: '1MB',   // Reject payload bigger than 1 MB 
  xmlParseOptions: {
    normalize: true,     // Trim whitespace inside text nodes 
    normalizeTags: true, // Transform tags to lowercase 
    explicitArray: false // Only put nodes in array if >1 
  }
}));
//swagger自动生成接口文档
//cnpm i -S express-swagger-generator
//主机/api-docs
const expressSwagger = require('express-swagger-generator')(app);

let options = {
    swaggerDefinition: {
        info: {
            description: '零七购',
            title: '零七购',
            version: '1.0.0',
        },
        host: 'localhost:3000',//要与express的端口保持一致
        //这是访问api的时候，api服务的根路径，就是主机名后面那个斜杠
        //如果是'/v1',测试的时候，访问api的路径就变成了:
        //http://localhost:3000/v1/users/login
        basePath: '/',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            //JWT这个名字不要改动，后面在路由注释上面会用到这个名称
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //当前app.js所在的绝对路径，也就是项目根目录
    files: ['./routes/**/*.js'] //路由文件的路径，*是通配符
};
expressSwagger(options)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', 
  'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', '3.2.1')
  if(req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});


app.use(function(req,res,next){
  reqUrl = req.originalUrl
  
  next()
})

app.use(expressJwt({
  secret:"H007",//加密秘钥
  requestProperty:"auth" //其定义存储属性，取值的时候，如:req.auth
}).unless({
  //指定哪些路由不需要jwt验证
  path:['/users/login','users/login','/registor','/gettoken','/api-docs',
  '/swiper/listswiper','/sendemail/send','/wx/openid',
'/clients/loginbyopenid','/clients/add','/wx/payback','/wx/payback/'],
  ext:['jpg','png','gif','js','css']
}));
/*
//对每个请求路径进行权限判断
let {checkPrivileges} = require("./middle/appjsprivilegescheck.js");
app.use(checkPrivileges);*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//引入所有的路由配置
let {appUseRoutes} = require("./middle/appuseroutes.js");
appUseRoutes(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
