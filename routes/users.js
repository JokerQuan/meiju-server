const router = require('koa-router')();

const UserHelper = require('../dbHelper/userHelper');
const errorCode = require('../common/errorCode')

/**
 * 用户名是否存在
 */
router.get('/api/hasuser', async function (ctx, next) {
  const {username} = ctx.request.query;
  let existedUser = await UserHelper.findOne({username});
  ctx.response.body = {
    code : 0,
    data : existedUser ? true : false
  }
});

/*
*注册
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


/*
* 登录
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

/**
 * 收藏美剧
 */
router.post('/api/star', async function (ctx, next) {
  const {meijuId} = ctx.request.body;
  //已登录
  if (ctx.session && ctx.session.userObj && ctx.session.userObj._id) {
    if (!meijuId) {
      ctx.response.body = {
        code : 5,
        errMsg : errorCode[5]
      }
      return;
    }

    let user = await UserHelper.findOne({_id: ctx.session.userObj._id});
    //未收藏
    if (user.favorates.indexOf(meijuId) === -1) {
      user.favorates.unshift(meijuId);
      user = await UserHelper.update({_id: ctx.session.userObj._id}, user);
      ctx.response.body = {
        code : 0,
        data : user.favorates.join(',')
      }
    } else {//已收藏
      ctx.response.body = {
        code : 6,
        errMsg : errorCode[6]
      }
    }
  } else { //未登录
    ctx.response.body = {
      code : 3,
      errMsg : errorCode[3]
    }
  }
});

/**
 * 取消收藏美剧
 */
router.post('/api/cancelStar', async function (ctx, next) {
  const {meijuId} = ctx.request.body;
  if (!meijuId) {
    ctx.response.body = {
      code : 5,
      errMsg : errorCode[5]
    }
  }
  //已登录
  if (ctx.session && ctx.session.userObj && ctx.session.userObj._id) {
    if (!meijuId) {
      ctx.response.body = {
        code : 5,
        errMsg : errorCode[5]
      }
      return;
    }

    let user = await UserHelper.findOne({_id: ctx.session.userObj._id});
    const index = user.favorates.indexOf(meijuId);
    //未收藏
    if (index === -1) {
      ctx.response.body = {
        code : 7,
        errMsg : errorCode[7]
      }
    } else {//已收藏
      user.favorates.splice(index, 1);
      user = await UserHelper.update({_id: ctx.session.userObj._id}, user);
      ctx.response.body = {
        code : 0,
        data : user.favorates.join(',')
      }
    }
  } else { //未登录
    ctx.response.body = {
      code : 3,
      errMsg : errorCode[3]
    }
  }
});

module.exports = router;
