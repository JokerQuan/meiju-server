const {ClientModel} = require('../db/models');

let ClientHelper = {};

ClientHelper.save = function (obj = {}) {
    return new Promise((resolve, reject) => {
        let clientModel = new ClientModel(obj);
        clientModel.save(function (err, client) {
            if (err) {
                reject(err);
            } else {
                resolve(client);
            }
        });
    });
};

module.exports = ClientHelper;