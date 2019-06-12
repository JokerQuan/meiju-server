const md5 = require('blueimp-md5');

const {UserModel} = require('../db/models');

let UserHelper = {};

UserHelper.findOne = function (obj = {}) {
    return new Promise((resolve, reject) => {
        if (obj.password) {
            obj.password = md5(obj.password);
        }
        UserModel.findOne(obj, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        })
    });
};

UserHelper.save = function (obj = {}) {
    return new Promise((resolve, reject) => {
        obj.password = md5(obj.password);
        let userModel = new UserModel(obj);
        userModel.save(function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

UserHelper.update = function (filter, obj = {}) {
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate(filter, obj, {new: true}, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

module.exports = UserHelper;
