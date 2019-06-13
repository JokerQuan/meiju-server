const recommeds = require('./recommend');
const {MeijuModel} = require('../db/models');

let MeijuHelper = {};

MeijuHelper.getRecommend = function () {
    return new Promise((resolve, reject) => {
        let results = [];
        for (let i = 0; i < recommeds.length; i++) {
            MeijuModel.findOne({title : recommeds[i]}, function (err, meiju) {
                if (err) {
                    reject(err);
                } else {
                    results.push(meiju);
                }
                if (results.length === recommeds.length) {
                    resolve(results.sort((a, b) => {
                        return a > b ? 1: -1; 
                    }));
                }
            });
        }
    });
};

MeijuHelper.getMeijuListByPage = function (obj = {}, page = 0) {
    return new Promise((resolve, reject) => {
        MeijuModel.find(obj)
            .skip(page * 24)
            .limit(24)
            .sort({'_id':-1})
            .exec((err, meijuList) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(meijuList);
                }
            });
    });
};

MeijuHelper.getMeijuCount = function (obj = {}) {
    return new Promise((resolve, reject) => {
        MeijuModel.count(obj, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
};


MeijuHelper.getMeijuListByIds = function (_ids = []) {
    return new Promise((resolve, reject) => {
        let results = [];
        for (let i = 0; i < _ids.length; i++) {
            MeijuModel.findOne({_id : _ids[i]}, function (err, meiju) {
                if (err) {
                    reject(err);
                } else {
                    results.push(meiju);
                }
                if (results.length === _ids.length) {
                    resolve(results);
                }
            });
        }
    });
};

module.exports = MeijuHelper;