var express      = require("express");
var router       = express.Router();
var Campground   = require("../models/campground");
var middleware   = require("../middleware");
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);


router.get("/", function(req, res){

//Get All campground from DB

    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allcampgrounds, page: "campgrounds"});
        }
    });


});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name=req.body.name;
    var price=req.body.price;
    var img=req.body.img;
    var descr=req.body.descr;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }

        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampg={name: name, price: price, img: img, descr: descr, author: author,  location: location, lat: lat, lng: lng};
     // Create a new campground and save to DB
        Campground.create(newCampg, function(err, newlyCamp){
           if(err){
               console.log(err);
           }else{
                res.redirect("/campgrounds");
           }
      });
   });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new");
});

// SHOW s more info
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err || !foundCamp){
            req.flash("error", "Campground not found");
            res.redirect("back");

        }else{

            res.render("campgrounds/show", {campground: foundCamp});
        }

    });
});
//EDIT SHOW
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCamp){
            res.render("campgrounds/edit",{campground: foundCamp});
        });
});

//UPDATE CAMPGROUNDS
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){

    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;

        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, upCamp){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }else{
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/"+upCamp._id);
            }
        });
    });
});

// DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})


module.exports  = router;