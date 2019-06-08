const mongoose = require('mongoose');
const md5 = require('blueimp-md5');

//1、连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/test', {useNewUrlParser:true});

mongoose.set('useFindAndModify', false);

//2、获取连接对象
const conn = mongoose.connection;

//3、监听
conn.on('connected', function () {
    console.log('数据库连接成功！');
});



/*
* 得到对应集合的Model
* collection集合 => 表
* Model一个文档 => 一条记录 => 一个对象
* Schema 描述文档结构
*/
//1、定义Schema
const userSchema = mongoose.Schema({
   username : {type : String, required : true},
   password : {type : String, required : true}
});

//2、定义Model（与集合对应，可操作集合）集合名称（表名）为 users，则model必须为 user
const UserModel = mongoose.model('user', userSchema);

/**
 * 通过Model或其实例对象操作数据库
 */
//1、保存
function testSave() {
    //创建Model实例
    const userModel = new UserModel({username: 'quan', password: md5('123')});
    //调用save()保存
    userModel.save(function (error, user) {
        console.log('save()', error, user)
    });
}
// testSave();


//2、查询
function testFind() {
    //查询多个 return [obj,obj] / []
    UserModel.find(function (error, users) {
        console.log('find()', error, users);
    });

    //查询一个 return obj / null
    UserModel.findOne({username: 'wang'}, function (error, user) {
        console.log('findOne()', error, user);
    })
}
// testFind();


//3、更新
function testUpdate() {
    // UserModel.findByIdAndUpdate();

    //返回老的user，upsert如果不存在，自动创建新的文档
    UserModel.findOneAndUpdate({username: 'laowang'}, {password: md5(456)}, {upsert: true}, function (error, oldUser) {
        console.log('findOneAndUpdate()', error, oldUser);
    });
}
// testUpdate();

//4、删除
function testDelete() {
    UserModel.deleteOne({username: 'laowang'}, function (error, user) {
        console.log('remove()', error, user);
    })
}
testDelete();