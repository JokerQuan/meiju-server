const router = require('koa-router')();

const errorCode = require('../common/errorCode');
const CommentHelper = require('../dbHelper/commentHelper');
const UserHelper = require('../dbHelper/userHelper.js');

//新增评论
router.post('/api/comment', async (ctx, next) => {
    const {content} = ctx.request.body;
    let commentObj = {};
    let user_id = 'anonymous';
    if (ctx.session && ctx.session.userObj && ctx.session.userObj._id) {
        user_id = ctx.session.userObj._id;
    }
    commentObj = {user_id, content};
    const comment = await CommentHelper.addComment(commentObj);
    let data = {
        _id         : comment._id,
        content     : comment.content,
        user_id     : comment.user_id,
        awesome     : comment.awesome,
        replay_list : comment.replay_list,
        create_time : comment.create_time
    };
    if (comment.user_id !== 'anonymous') {
        const user = await UserHelper.findOne({_id : comment.user_id});
        data.user_name = user.username;
        data.user_avatar = user.avatar;
    }
    if (data) {
        ctx.response.body = {
            code : 0,
            data
        }
    } else {
        ctx.response.body = {
            code : 4,
            errMsg : errorCode[4]
        }
    }
});

//获取评论
router.get('/api/comment/:page', async (ctx, next) => {
    const {page} = ctx.params;
    let commentList = await CommentHelper.getCommentListByPage(page);

    //map函数中使用async、await会返回promise
    const promises = commentList.map(async comment => {
        //mongoose查询到的数据，不允许添加Schema指定以外的属性，所以要先取出来
        let tempObj = {
            _id         : comment._id,
            content     : comment.content,
            user_id     : comment.user_id,
            awesome     : comment.awesome,
            replay_list : comment.replay_list,
            create_time : comment.create_time
        };
        if (tempObj.user_id !== 'anonymous') {
            const user = await UserHelper.findOne({_id : tempObj.user_id});
            tempObj.user_name = user.username;
            tempObj.user_avatar = user.avatar;
        }
        return tempObj;
    });

    const data = await Promise.all(promises);

    ctx.response.body = {
        code : 0,
        data
    }
});


//获取评论总数
router.get('/api/commentCount', async (ctx, next) => {
    const count = await CommentHelper.getCommentCount();
    ctx.response.body = {
        code : 0,
        data : {count}
    }
});


//点赞、取消点赞
router.post('/api/awesome', async (ctx, next) => {
    const {commentId, clientIP} = ctx.request.body;

    const isLogin = ctx.session && ctx.session.userObj && ctx.session.userObj._id;

    let comment = await CommentHelper.findOne({_id : commentId});
    let isAwesome = false;
    //如果登录了，就判断用户ID，没有登录则判断客户端IP
    if (isLogin) {
        isAwesome = comment.awesome.indexOf(ctx.session.userObj._id) !== -1;
    } else {
        isAwesome = comment.awesome.indexOf(clientIP) !== -1;
    }

    if (!isAwesome) {
        if (isLogin) {
            comment.awesome.push(ctx.session.userObj._id);
        } else {
            comment.awesome.push(clientIP);
        }
    } else {
        if (isLogin) {
            comment.awesome.splice(comment.awesome.indexOf(ctx.session.userObj._id), 1);
        } else {
            comment.awesome.splice(comment.awesome.indexOf(clientIP), 1);
        }
    }

    const result = await CommentHelper.update({_id : commentId}, {awesome : comment.awesome});
    ctx.response.body = {
        code : 0,
        data : result
    }
});


module.exports = router;