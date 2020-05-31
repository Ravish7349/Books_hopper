var express=require("express");
var moment=require("moment");
var router=express.Router();
var Book=require("../models/addbook");
var User=require("../models/users");
var Cart=require("../models/cart");
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var middleware=require("../middleware");

//Main Page
router.get("/bookshopper",function(req,res){
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Book.find({name:regex},function(err,allbooks){
			if(err){
				console.log(err);
			}else{
				res.render("bookshoppers/bookshopper",{books:allbooks,currentUser:req.user});
			}
		});
	}else{
		Book.find({},function(err,allbooks){
			if(err){
				console.log(err);
			}else{
				res.render("bookshoppers/bookshopper",{books:allbooks,currentUser:req.user});
			}
		});
	}
});
//Redering AddBook
router.get("/bookshopper/addbooks",middleware.isLoggedIn,function(req,res){
	res.render("bookshoppers/addbooks",{currentUser:req.user});
});
//Add Books(Create)
router.post("/bookshopper",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var bookauthor=req.body.bookauthor;
	var image=req.body.image;
	var price=(req.body.price*(60/100));
	var price1=(req.body.price*(45/100));
    var description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
	var newbook={name:name,image:image,price:price,description:description,author:author,bookauthor:bookauthor}
	Book.create(newbook,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			req.flash("success","SUCCESSFULLY BOOK HAS BEEN ADDED...!");
			req.flash("success2","Books_Hopper team will collect your book before "+ moment().add(3, 'day').format("dddd DD MM YYYY") +" and Rs "+price1+"(45% of MRP)	will be paid immediately on collecting the book...!")
			res.redirect("/bookshopper");
		}
	});
});


router.get("/bookshopper/:id",middleware.isLoggedIn,function(req,res){
	Book.findById(req.params.id).populate("comments").exec(function(err,booksearch){
		if(err){
			console.log(err);
		}else{
			res.render("bookshoppers/booksinfo",{books:booksearch});
		}
	});
});

//Edit Added Book
router.get("/bookshopper/:id/editbook",middleware.checkbookownership,function(req,res){
		Book.findById(req.params.id,function(err,editbook){
			if(err){
				req.flash("error","YOU DON'T HAVE THE PREMISSION TO EDIT THIS BOOK !!!");
			}
			res.render("bookshoppers/editbook",{book:editbook});
	});	
});

router.put("/bookshopper/:id",middleware.checkbookownership,function(req,res){
	//find and update the correct book
	Book.findByIdAndUpdate(req.params.id,req.body.book,function(err,updatedbook){
		if(err){
			req.flash("error","YOU DON'T HAVE THE PREMISSION TO EDIT THIS BOOK !!!");
			res.redirect("/bookshopper");
		}else{
			req.flash("success","YOUR BOOK HAS BEEN UPDATED !!!");
			res.redirect("/bookshopper/"+ req.params.id);
		}
	});
});

//Delete Book(Destroy)
router.delete("/bookshopper/:id",function(req,res){
	Book.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error","YOU DON'T HAVE THE PREMISSION TO DELETE THIS BOOK !!!");
			res.redirect("/bookshopper");
		}else{
			res.redirect("/bookshopper");
		}
	});
});

router.get("/bookshopper/:id/cart",middleware.isLoggedIn,function(req,res){
	Book.findById(req.params.id,function(err,cartbook){
		if(err){
			req.flash("error","YOU DON'T HAVE THE PREMISSION TO EDIT THIS BOOK !!!");
		}
		res.render("bookshoppers/cart",{book:cartbook});
});	
});

router.post("/bookshopper/:id/cart",middleware.isLoggedIn,function(req,res){
	Book.findById(req.params.id,function(err,commentbooks){
		if(err){
			req.flash("error","SOMETHING WENT WRONG !!!")
			console.log(err);
			redirect("/bookshopper/bookinfo");
		}else{
			var name=req.body.name;
			var bookauthor=req.body.bookauthor;
			var price=req.body.price;
			var author={
				id:req.user._id,
				username:req.user.username,
				address:req.user.address
			}
			var newcart={author:author,name:name,price,price}
			Cart.create(newcart,function(err,newcartbook){
				if(err){  
					console.log(err);
				}else{
					res.redirect("/bookshopper/"+req.params.id+"/cart/checkout");
				}
			});
		}
	});
});
			
router.get('/bookshopper/:id/cart/checkout',middleware.isLoggedIn,async (req, res) => {
	Book.findById(req.params.id,async(err,cartbook)=>{
		if(err){
			req.flash("error","YOU DON'T HAVE THE PREMISSION TO EDIT THIS BOOK !!!");
		}
	try{
		const paymentIntent = await stripe.paymentIntents.create({
			amount:200,
			currency: 'inr',
			// Verify your integration in this guide by including this parameter
			metadata: {integration_check: 'accept_a_payment'},
		  });
		  const {client_secret}=paymentIntent;
		res.render('checkout', { client_secret ,amount:"200",books:cartbook});
	}catch(err){
		console.log(err);
		req.flash("error",err.message);
		res.redirect("back");
	}
	});
});


router.get("/bookshopper/:id/cart/checkout/thankyou",middleware.isLoggedIn,function(req,res){
	Book.findById(req.params.id,function(err,thank){
		if(err){
			console.log(err);
		}
		res.render("thankyou",{books:thank});
});	
		
});	


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;