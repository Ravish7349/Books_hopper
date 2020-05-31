var mongoose=require("mongoose");
var passwordlocalmongoose=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    firstname:String,
    lastname:String,
    tele:Number,
    address:String

});
userSchema.plugin(passwordlocalmongoose);
module.exports=mongoose.model("User",userSchema);