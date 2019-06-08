const {CategoryModel} = require('../db/models');

let CategoryHelper = {};

/*目前只有一条数据*/
CategoryHelper.findOne = function (obj = {}) {
    return new Promise((resolve, reject) => {
        CategoryModel.findOne(obj, function (err, category) {
            if (err) {
                reject(err);
            } else {
                resolve(category);
            }
        })
    });
};


module.exports = CategoryHelper;