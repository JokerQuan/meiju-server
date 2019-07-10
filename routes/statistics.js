const router = require('koa-router')();

const CategoryHelper = require('../dbHelper/categoryHelper');
const MeijuHelper = require('../dbHelper/meijuHelper');

/**
 * 分类
 */
router.get('/api/statistics/type', async function (ctx, next) {
    let category = await CategoryHelper.findOne({});
    const typeList = category.types;
    
    //map函数中使用async、await会返回promise
    const promises = typeList.map(async type => {
        const count = await MeijuHelper.getMeijuCount({type});
        const tempObj = {
            type,
            count
        }
        return tempObj;
    });

    const data = await Promise.all(promises);

    ctx.response.body = {
        code : 0,
        data
    };
});

/**
 * 地区
 */
router.get('/api/statistics/area', async function (ctx, next) {
    let category = await CategoryHelper.findOne({});
    const areaList = category.areas;
    
    //map函数中使用async、await会返回promise
    const promises = areaList.map(async area => {
        const count = await MeijuHelper.getMeijuCount({area});
        const tempObj = {
            area,
            count
        }
        return tempObj;
    });

    const data = await Promise.all(promises);

    ctx.response.body = {
        code : 0,
        data
    };
});

/**
 * 标签
 */
router.get('/api/statistics/tags', async function (ctx, next) {
    let category = await CategoryHelper.findOne({});
    const tagList = category.tags;
    
    //map函数中使用async、await会返回promise
    const promises = tagList.map(async tag => {
        const reg = new RegExp(tag,'i');
        const count = await MeijuHelper.getMeijuCount({tags:{$regex:reg}});
        const tempObj = {
            tag,
            count
        }
        return tempObj;
    });

    const data = await Promise.all(promises);

    ctx.response.body = {
        code : 0,
        data
    };
});

module.exports = router;
