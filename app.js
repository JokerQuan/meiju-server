const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-session');

const index = require('./routes/index');
const users = require('./routes/users');
const category = require('./routes/category');
const meiju = require('./routes/meiju');
const comment = require('./routes/comment');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.keys = ['meiju'];
app.use(session({
  key : 'sessionId',
  maxAge : 1000 * 60 * 60 * 24 * 7, //7天
  overwrite: true,  //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: false,   //签名默认true
  rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false,  //(boolean) renew session when session is nearly expired
}, app));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(category.routes(), category.allowedMethods());
app.use(meiju.routes(), meiju.allowedMethods());
app.use(comment.routes(), comment.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
