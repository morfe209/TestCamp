var express=require("express"),
    app=express(),
    bodyParser= require("body-parser"),
    mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
// SCHEMA SETUP

var campgroudsSchema=new mongoose.Schema({
    name: String,
    img: String,
    descr: String
});

var Campground = mongoose.model("Campground", campgroudsSchema);

//Create a NEW CAMPGROUND
//====================================================================
// Campground.create({
//         name: "Glacier Basin Campground",
//         img: "https://www.nps.gov/common/uploads/structured_data/B51D1028-1DD8-B71B-0BD70D7C96AD7D46_thumb.jpg",
//         descr: "A pleasant mix of Douglas fir, Lodgepole pine, Ponderosa pine, and the occasional Engelmann spruce forests the campground, offering equal amounts of sun and shade. Grasses, shrubs and seasonal wildflowers fill the open meadows."
//     },
//     function(err, newlyCamp) {
//         if(err){
//             console.log("something wrong");
//         }else{
//             console.log("add OK");
//         }
//     });

//====================================================================

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    
    //Get All campground from DB
    
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);            
        }else{
            res.render("index", {campgrounds: allcampgrounds}    );
        }
    });
    
        
});

app.post("/campgrounds", function(req, res){
    var name=req.body.name;
    var img=req.body.img;
    var descr=req.body.descr;
    var newCampg={name: name, img: img, descr: descr};
   //Create a new campgrount
   Campground.create(newCampg, function(err, newlyCamp){
       if(err){
           console.log(err)
       }else{
            res.redirect("/campgrounds"); 
       }
   });
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new");
});

// SHOW s more info
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log("errr");
        }else{
            res.render("show", {campground: foundCamp});
        }
        
    });
    
    
   
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Yelp Camp server running"); 
});