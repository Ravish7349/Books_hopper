var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/users");

//Start Page
router.get("/",function(req,res){
	res.render("startpage");
});
//AUTH ROUTTES
//Sign UP
router.get("/register",function(req,res){
	res.render("register");
});

//Sign Up

router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username,firstname:req.body.firstname,lastname:req.body.lastname,email:req.body.email,tele:req.body.tele,address:req.body.address});
	User.register(newUser,req.body.password,function(err,User){
		if(err){
			req.flash("error","USERNAME ALREDY EXISTS, PLEASE TRY OTHER USERNAME");
			res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.firstname +" " +req.body.lastname);
			res.redirect("/bookshopper");
		});
	});
});

//Login In
router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local",
	{
		successRedirect:"/bookshopper",
		failureRedirect:"/login"
	}),function(req,res){
});

//Log Out
router.get("/logout",function(req,res){
	req.logOut();
	req.flash("success","LOGGED YOU OUT!")
	res.redirect("/bookshopper")
});
module.exports=router;