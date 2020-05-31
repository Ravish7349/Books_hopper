var Book=require("../models/addbook");
var	CommentBook=require("../models/commentbook");
//All the MIDDLEWARE
var middlewareObj={};

middlewareObj.checkbookownership=function(req,res,next){
	if(req.isAuthenticated()){
		Book.findById(req.params.id,function(err,editbook){
			if(err){
				req.flash("error","BOOK NOT FOUND")
				res.redirect("back");
			}else{
				if(editbook.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","YOU DON'T HAVE PERMISSION TO DO THAT !!!")
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}		
}

middlewareObj.checkcommentownership=function(req,res,next){
	if(req.isAuthenticated()){
		CommentBook.findById(req.params.comment_id,function(err,editcomment){
			if(err){
				res.redirect("back");
			}else{
				if(editcomment.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","YOU NEED TO BE LOGGED IN TO DO THAT !!!! ");
		res.redirect("back");
	}		
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
    }
    req.flash("error","YOU NEED TO BE LOGGED IN TO DO THAT !!!! ");
	res.redirect("/login");
}

module.exports=middlewareObj