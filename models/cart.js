var mongoose=require("mongoose");
//Schema Setup
var cartSchema= new mongoose.Schema({
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String,
        address:String
    },
        name:String,   
        price:String,
        bookauthor:String
});

module.exports=mongoose.model("Cart",cartSchema);