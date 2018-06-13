var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware   = require("../middleware");



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
    var newCampg={name: name, price: price, img: img, descr: descr, author: author};
//Create a new campgrount
   Campground.create(newCampg, function(err, newlyCamp){
       if(err){
           console.log(err);
       }else{
            res.redirect("/campgrounds");
       }
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
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, upCamp){

        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+upCamp._id);
        }
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