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
  let existedUser = await UserHelper.findOne({username});
  if (existedUser) {
    ctx.response.body = {
      code : 1,
      errMsg : errorCode[1]
    }
  } else {
    let savedUser = await UserHelper.save(ctx.request.body);
    if (savedUser) {
      const userObj = {
        _id : savedUser._id,
        username : savedUser.username,
        favorates : savedUser.favorates,
        avatar : savedUser.avatar
      };

      ctx.session.userObj = userObj;

      ctx.response.body = {
        code : 0,
        data : userObj
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
router.post('/api/login', async function (ctx, next) {
  const {username, password} = ctx.request.body;
  let user = await UserHelper.findOne({username, password});
  if (user) {
    const userObj = {
      _id : user._id,
      username : user.username,
      favorates : user.favorates,
      avatar : user.avatar
    };

    ctx.session.userObj = userObj;
    ctx.response.body = {
      code : 0,
      data : userObj
    }
  } else {
    ctx.response.body = {
      code : 2,
      errMsg : errorCode[2]
    }
  }
});

/**
 * 退出登录
 */
router.post('/api/signout', async function(ctx, next) {
  if (ctx.session.userObj) {
    ctx.session = null;
    ctx.response.body = {
      code : 0
    }
  } else {
    ctx.response.body = {
      code : 3,
      errMsg : errorCode[3]
    }
  }
});

module.exports = router;
