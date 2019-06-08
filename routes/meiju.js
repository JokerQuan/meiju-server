const router = require('koa-router')();

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
    const meijuList = await MeijuHelper.getMeijuListByPage({}, page);
    ctx.response.body = {
        code : 0,
        data : meijuList
    }
});

//查询总数
router.get('/api/meijuCount', async (ctx, next) => {
    const count = await MeijuHelper.getMeijuCount();
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

module.exports = router;