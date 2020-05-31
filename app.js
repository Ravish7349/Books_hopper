require('dotenv').config()
var express=require("express"),
	app=express(),
	bodyparser=require("body-parser"),
	mongoose=require("mongoose"),
	flash=require("connect-flash");
	passport=require("passport"),
	LocalStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	Book=require("./models/addbook"),
	CommentBook=require("./models/commentbook"),
	User=require("./models/users");
	Cart=require("./models/cart");
	require('dotenv').config()



//Requiring Routes
var commmentRoutes=require("./routes/comment"),
	bookshopperRoutes=require("./routes/bookshopper"),
	authRoutes=require("./routes/auth");

	mongoose.connect("mongodb://localhost/books_hopper", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"U people can buy ur required book",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	res.locals.success2=req.flash("success2");
	res.locals.message=req.flash("message");
	next();
});

var books=[
	{name:"Mathematic",image:"https://images-na.ssl-images-amazon.com/images/I/418O6bwju2L.jpg"}
]
app.use(authRoutes);
app.use(bookshopperRoutes);
app.use("/bookshopper/:id/comments",commmentRoutes);


app.listen(process.env.PORT||3002,process.env.IP,function(){
	console.log("Check My Website,It has been STARTED!!!!")
});