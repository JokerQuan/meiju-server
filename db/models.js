const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);

mongoose.connect('mongodb://127.0.0.1:27017/meiju');

const conn = mongoose.connection;

conn.on('connected', function () {
    console.log('--------db connect success!!--------');
});


/*用户*/
const userSchema = mongoose.Schema({
    avatar : {type : String, require : true},
    username : {type : String, required : true},
    password : {type : String, required : true},
    favorates : {type : Array, default : []}
});
const UserModel = mongoose.model("user", userSchema);
exports.UserModel = UserModel;


/*美剧*/
const meijuSchema = mongoose.Schema({
    href:String,        //链接
    title:String,       //标题
    pic_url:String,     //图片地址
    en_title:String,    //原名
    alias_title:String, //别名
    birth_date:String,  //首播日期
    area:String,        //地区
    type:String,        //类型
    tags:String,         //标签
    translator:String,  //翻译
    files: Array        //下载列表
});
const MeijuModel = mongoose.model("Meiju", meijuSchema);
exports.MeijuModel = MeijuModel;


/*分类*/
const categorySchema = mongoose.Schema({
    tags : Array,
    areas : Array,
    types : Array
});
const CategoryModel = mongoose.model("category", categorySchema);
exports.CategoryModel = CategoryModel;