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
    files: Array,       //下载列表
    comment_list: Array //评论列表
});
const MeijuModel = mongoose.model("Meiju", meijuSchema);
exports.MeijuModel = MeijuModel;


/*分类*/
const categorySchema = mongoose.Schema({
    tags : Array,
    areas : Array,
    types : Array
});
const CategoryModel = mongoose.model("categorys", categorySchema);
exports.CategoryModel = CategoryModel;


/*评论*/
const commentSchema = mongoose.Schema({
    user_id : String,
    content : {type : String, require : true},
    create_time : {type : String, require : true},
    awesome : Array,
    replay_list : Array
});
const CommentModel = mongoose.model("comment", commentSchema);
exports.CommentModel = CommentModel;


/*客户端*/
const clientSchema = mongoose.Schema({
    ip : {type : String, require : true},
    addr_code : {type : String, require : true},
    addr_name : {type : String, require : true},
    address : {type : String, require : true},
    date : {type : String, require : true}
});
const ClientModel = mongoose.model("client", clientSchema);
exports.ClientModel = ClientModel;