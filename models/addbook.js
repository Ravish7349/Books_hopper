var mongoose=require("mongoose");
//Schema Setup
var bookSchema= new mongoose.Schema({
    name:String, 
    bookauthor:String,  
    image:String,
    price:String,
    description:String,
  
    createdAt: { type: Date, default: Date.now },
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CommentBook"
        }
    ],
});

module.exports=mongoose.model("Book",bookSchema);