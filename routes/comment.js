var express=require("express");
var router=express.Router({mergeParams:true});
var Book=require("../models/addbook");
var CommentBook=require("../models/commentbook");
var middleware=require("../middleware");

//New Comment
router.get("/newcomment",middleware.isLoggedIn,function(req,res){
	Book.findById(req.params.id,function(err,commentbook){
		if(err){
			console.log(err);
		}else{
			res.render("commentbook/newcomment.ejs",{books:commentbook});
		}
	});
});

//Comment Create
router.post("/",middleware.isLoggedIn,function(req,res){
	Book.findById(req.params.id,function(err,commentbooks){
		if(err){
			req.flash("error","SOMETHING WENT WRONG !!!")
			console.log(err);
			redirect("/books_hopper");
		}else{
			CommentBook.create(req.body.comment,function(err,comment){
				if(err){  
					console.log(err);
				}else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
                    //save comment
					commentbooks.comments.push(comment);
					commentbooks.save();
					res.redirect("/bookshopper/"+req.params.id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit",middleware.checkcommentownership,function(req,res){
	CommentBook.findById(req.params.comment_id,function(err,commentbook){
		if(err){
			res.redirect("back");
		}else{
			res.render("commentbook/editcomment",{books_id:req.params.id,comment:commentbook});
		}
	});
});

router.put("/:comment_id",middleware.checkcommentownership,function(req,res){
	CommentBook.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,commentbook){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/bookshopper/"+req.params.id);
		}
	});
});

router.delete("/:comment_id",function(req,res){
	CommentBook.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			req.flash("error","YOU DON'T HAVE THE PERMISSION TO DELETE")
			res.redirect("back");
		}else{
			req.flash("success","COMMENT DELETED !!!")
			res.redirect("/bookshopper/"+req.params.id);
		}
	})
});



module.exports=router;