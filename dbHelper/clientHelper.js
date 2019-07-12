const {ClientModel} = require('../db/models');

let ClientHelper = {};

ClientHelper.update = function (obj = {}) {
    return new Promise((resolve, reject) => {
        ClientModel.findOneAndUpdate({ip:obj.ip}, obj, {upsert:true}, function (err, client) {
            if (err) {
                reject(err);
            } else {
                resolve(client);
            }
        });
    });
};

module.exports = ClientHelper;