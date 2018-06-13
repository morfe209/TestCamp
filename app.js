require('dotenv').config();

var express                 = require("express"),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash"),
    Campground              = require("./models/campground"),
    User                    = require("./models/user"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./seeds")

var commentRounts   = require("./routes/comments"),
    campgroundRouts = require("./routes/campgrounds"),
    indexRoutes      =require("./routes/index");



mongoose.connect("mongodb://localhost/yelp_camp_12");


var app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seedDB();

//PASSPORT CONFIGURATIONM
app.use(require("express-session")({
    secret: "Once again rusty win cutest dog!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser   = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRouts);
app.use("/campgrounds/:id/comments", commentRounts);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Yelp Camp server running");
});