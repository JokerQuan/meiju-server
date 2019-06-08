const router = require('koa-router')();

const UserHelper = require('../dbHelper/userHelper');

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
  const {username} = ctx.request.query;
  let existedUser = await UserHelper.findOne({username});
  if (existedUser) {
    ctx.response.body = {
      code : 1,
      errMsg : '用户名已存在！'
    }
  } else {
    let savedUser = await UserHelper.save(ctx.request.query);
    if (savedUser) {
      const data = {username, _id: savedUser._id};

      ctx.cookies.set('userid', savedUser._id,{
        maxAge:1000*60*60*24,
        overwrite:true
      });

      ctx.response.body = {
        code : 0,
        data
      };
    } else {
      ctx.response.body = {
        code : 4,
        errMsg : '未知错误！'
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
*     code : 1,
*     error : '用户名或密码错误'
*   }
* }
* */

module.exports = router;
