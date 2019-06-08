const router = require('koa-router')();

const CategoryHelper = require('../dbHelper/categoryHelper');

router.get('/api/category', async (ctx, next) => {
    let category = await CategoryHelper.findOne({});
    if (category) {
        ctx.response.body = {
            code : 0,
            data : category
        };
    } else {
        ctx.response.body = {
            code : 4,
            errMsg : '未知错误！'
        };
    }
});

module.exports = router;
