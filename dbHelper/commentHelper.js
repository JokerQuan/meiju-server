const moment = require("moment");

const {CommentModel} = require('../db/models');

let CommentHelper = {};

CommentHelper.findOne = function (obj = {}) {
    return new Promise((resolve, reject) => {
        CommentModel.findOne(obj, function (err, comment) {
            if (err) {
                reject(err);
            } else {
                resolve(comment);
            }
        })
    });
};

CommentHelper.addComment = function (commentObj = {}) {
    return new Promise((resolve, reject) => {
        commentObj.create_time = moment().valueOf();
        commentObj.awesome = [];
        commentObj.replay_list = [];
        const comment = new CommentModel(commentObj);
        comment.save(function (err, comment) {
            if (err) {
                reject(err);
            } else {
                resolve(comment);
            }
        });
    });
};

CommentHelper.getCommentListByPage = function (page = 0) {
    return new Promise((resolve, reject) => {
        CommentModel.find({})
            .skip(page * 20)
            .limit(20)
            .sort({'create_time' : -1})
            .exec((err, commentList) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(commentList);
                }
            });
    }); 
}

CommentHelper.getCommentCount = function () {
    return new Promise((resolve, reject) => {
        CommentModel.count({}, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    }); 
}

CommentHelper.update = function (filter, obj = {}) {
    return new Promise((resolve, reject) => {
        CommentModel.findOneAndUpdate(filter, obj, {new: true}, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

module.exports = CommentHelper;