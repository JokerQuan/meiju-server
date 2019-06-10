const router = require('koa-router')();

const UserHelper = require('../dbHelper/userHelper');
const errorCode = require('../common/errorCode')


router.get('/api/hasuser', async function (ctx, next) {
  const {username} = ctx.request.query;
  let existedUser = await UserHelper.findOne({username});
  ctx.response.body = {
    code : 0,
    data : existedUser ? true : false
  }
});
/*注册
* 请求方式 post
* 参数：{
*   username : String,
*   password : String
* }
*
* 返回：
*   成功：{
*   code : 0,
*   data : {
*     username : 'xxx'
*   }
*   失败： {
*     code : 1,
*     error : '用户名已存在'
*   }
* }
* */
router.post('/api/register', async function (ctx, next) {
  const {username} = ctx.request.body;
  console.log(ctx.request.body)
  let existedUser = await UserHelper.findOne({username});
  if (existedUser) {
    ctx.response.body = {
      code : 1,
      errMsg : errorCode[1]
    }
  } else {
    let savedUser = await UserHelper.save(ctx.request.body);
    if (savedUser) {
      const data = {username, _id: savedUser._id};
      ctx.response.body = {
        code : 0,
        data
      };
    } else {
      ctx.response.body = {
        code : 4,
        errMsg : errorCode[4]
      };
    }
  }
});


/*登录
* 请求方式 post
* 参数：{
*   username : String,
*   password : String
* }
*
* 返回：
*   成功：{
*   code : 0,
*   data : {
*     username : 'xxx'
*   }
*   失败： {
*     code : 2,
*     error : '用户名或密码错误'
*   }
* }
* */

module.exports = router;
