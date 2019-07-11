const router = require('koa-router')();
const moment = require('moment');

const errorCode = require('../common/errorCode');
const MeijuHelper = require('../dbHelper/meijuHelper');
const CategoryHelper = require('../dbHelper/categoryHelper');

//站长推荐
router.get('/api/recommend', async (ctx, next) => {
    const recommendMeijuList = await MeijuHelper.getRecommend();
    ctx.response.body = {
        code : 0,
        data : recommendMeijuList
    }
});

//分页查询
router.get('/api/meiju/:page', async (ctx, next) => {
    const {page} = ctx.params;
    const {type, area, tags, year} = ctx.request.query;
    let filters = [];
    if (type) {
        const reg = new RegExp(type,'i');
        filters.push({type:{$regex:reg}});
    }
    if (area) {
        const reg = new RegExp(area,'i');
        filters.push({area:{$regex:reg}});
    }
    if (tags) {
        const tagList = tags.split(',');
        tagList.map(tag => {
            const reg = new RegExp(tag,'i');
            filters.push({tags : {$regex:reg}});
            return tag;
        })
    }
    if (year) {
        const reg = new RegExp(year,'i');
        filters.push({birth_date:{$regex:reg}});
    }

    const filterObj = filters.length > 0 ? {$and : filters} : {};

    const meijuList = await MeijuHelper.getMeijuListByPage(filterObj, page);
    ctx.response.body = {
        code : 0,
        data : meijuList
    }
});

//查询总数
router.get('/api/meijuCount', async (ctx, next) => {
    const {type, area, tags, year} = ctx.request.query;
    let filters = [];
    if (type) {
        const reg = new RegExp(type,'i');
        filters.push({type:{$regex:reg}});
    }
    if (area) {
        const reg = new RegExp(area,'i');
        filters.push({area:{$regex:reg}});
    }
    if (tags) {
        const tagList = tags.split(',');
        tagList.map(tag => {
            const reg = new RegExp(tag,'i');
            filters.push({tags : {$regex:reg}});
            return tag;
        })
    }
    if (year) {
        const reg = new RegExp(year,'i');
        filters.push({birth_date:{$regex:reg}});
    }

    const filterObj = filters.length > 0 ? {$and : filters} : {};

    const count = await MeijuHelper.getMeijuCount(filterObj);
    ctx.response.body = {
        code : 0,
        data : {count}
    }
});

//按条件查询总数
router.get('/api/category/:prop/:index/count', async (ctx, next) => {
    const {prop, index} = ctx.params;
    const category = await CategoryHelper.findOne();
    const filterObj = {};
    if (prop === 'tags') {
        const reg=new RegExp(category[prop][index],'i');
        filterObj[prop] = {$regex:reg};
    } else {
        filterObj[prop] = category[prop + 's'][index];
    }
    const count = await MeijuHelper.getMeijuCount(filterObj);
    ctx.response.body = {
        code : 0,
        data : {count}
    }
});

//按条件查询
router.get('/api/category/:prop/:index/:page', async (ctx, next) => {
    const {prop, index, page} = ctx.params;
    const category = await CategoryHelper.findOne();
    const filterObj = {};
    if (prop === 'tags') {
        const reg=new RegExp(category[prop][index],'i');
        filterObj[prop] = {$regex:reg};
    } else {
        filterObj[prop] = category[prop + 's'][index];
    }
    const meijuList = await MeijuHelper.getMeijuListByPage(filterObj, page);
    ctx.response.body = {
        code : 0,
        data : meijuList
    }
});

//按名称搜索结果总数
router.get('/api/search/:keyword/count', async (ctx, next) => {
    const {keyword} = ctx.params;
    const reg = new RegExp(keyword,'i');
    const filterObj = {$or:[
        {title: {$regex : reg}},
        {alias_title: {$regex : reg}},
        {en_title: {$regex : reg}}
    ]};
    const count = await MeijuHelper.getMeijuCount(filterObj);
    ctx.response.body = {
        code : 0,
        data : {count}
    }
});

//按名称搜索
router.get('/api/search/:keyword/:page', async (ctx, next) => {
    const {keyword, page} = ctx.params;
    const reg = new RegExp(keyword,'i');
    const filterObj = {$or:[
        {title: {$regex : reg}},
        {alias_title: {$regex : reg}},
        {en_title: {$regex : reg}}
    ]};
    const meijuList = await MeijuHelper.getMeijuListByPage(filterObj, page);
    ctx.response.body = {
        code : 0,
        data : meijuList
    }
});

//评论
router.post('/api/meiju/comment', async (ctx, next) => {
    const {meijuID, content} = ctx.request.body;
    let meiju = await MeijuHelper.findOne({_id: meijuID});
    let user = {};
    if (ctx.session && ctx.session.userObj && ctx.session.userObj._id) {
        user = {
            _id : ctx.session.userObj._id,
            username : ctx.session.userObj.username,
            user_avatar : ctx.session.userObj.avatar
        }
    } else {
        user = {
            _id : 'anonymous',
            username : '游客',
            user_avatar : 0
        }
    }
    const create_time = moment().valueOf();
    const comment = {
        _id : user._id + '_' + create_time,
        user_id : user._id,
        user_name : user.username,
        user_avatar : user.user_avatar,
        content,
        create_time,
        replay_list : [],
        awesome : []
    }
    meiju.comment_list.unshift(comment);
    const result = await MeijuHelper.update({_id : meijuID}, meiju);
    ctx.response.body = {
        code : 0,
        data : result
    }
});

//删除评论
router.post('/api/meiju/delComment', async (ctx, next) => {
    const {meijuID, commentID} = ctx.request.body;
    let meiju = await MeijuHelper.findOne({_id: meijuID});
    if (ctx.session && ctx.session.userObj && ctx.session.userObj.username === 'Admin') {
        let {comment_list} = meiju;
        let index = null;
        for (let i = 0; i < comment_list.length; i++) {
            if (commentID === comment_list[i]._id) {
                index = i;
            }
        }
        if (index !== null) {
            comment_list.splice(index, 1);
            const data = await MeijuHelper.update({_id:meijuID}, {comment_list});
            ctx.response.body = {
                code : 0,
                data
            }
        } else {
            ctx.response.body = {
                code : 9,
                errMsg : errorCode[9]
            }
        }
    } else {
        ctx.response.body = {
            code : 8,
            errMsg : errorCode[8]
        }
    }
});

router.post('/api/meiju/awesome', async (ctx, next) => {
    const {meijuID, commentId, clientIP} = ctx.request.body;
    const isLogin = ctx.session && ctx.session.userObj && ctx.session.userObj._id;
    const meiju = await MeijuHelper.findOne({_id: meijuID});
    let comment = {};
    meiju.comment_list.map(_comment => {
        if (commentId === _comment._id) {
            comment = _comment;
        }
        return _comment;
    });
    
    let isAwesome = false;
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

    const comment_list = meiju.comment_list.map(_comment => {
        if (commentId === _comment._id) {
            return comment;
        }
        return _comment;
    });

    const data = await MeijuHelper.update({_id : meijuID}, {comment_list});
    ctx.response.body = {
        code : 0,
        data
    }
});

router.post('/api/meiju/replay', async (ctx, next) => {
    const {meijuID, comment_id, from_id, from_name, to_id, to_name, content} = ctx.request.body;
    const meiju = await MeijuHelper.findOne({_id: meijuID});
    const comment_list = meiju.comment_list.map(comment => {
        if (comment_id === comment._id) {
            comment.replay_list.push({
                from_id,
                from_name,
                to_id,
                to_name,
                content,
                create_time : moment().valueOf()
            });
        }
        return comment;
    });
    const data = await MeijuHelper.update({_id:meijuID}, {comment_list});
    ctx.response.body = {
        code : 0,
        data
    }
});

module.exports = router;