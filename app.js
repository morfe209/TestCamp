var express=require("express");
var app=express();
var bodyParser= require("body-parser");

var campgrounds=[
            {name:"Vova", img: "http://www.photosforclass.com/download/flickr-3753652218"},
            {name:"Vova1", img: "http://www.photosforclass.com/download/flickr-14435096036"},
            {name:"Vova2", img: "http://www.photosforclass.com/download/flickr-2182093741"},
            {name:"Vova3", img: "http://www.photosforclass.com/download/flickr-7121861565"},            {name:"Vova", img: "http://www.photosforclass.com/download/flickr-3753652218"},
            {name:"Vova1", img: "http://www.photosforclass.com/download/flickr-14435096036"},
            {name:"Vova2", img: "http://www.photosforclass.com/download/flickr-2182093741"},
            {name:"Vova3", img: "http://www.photosforclass.com/download/flickr-7121861565"},            {name:"Vova", img: "http://www.photosforclass.com/download/flickr-3753652218"},
            {name:"Vova1", img: "http://www.photosforclass.com/download/flickr-14435096036"},
            {name:"Vova2", img: "http://www.photosforclass.com/download/flickr-2182093741"},
            {name:"Vova3", img: "http://www.photosforclass.com/download/flickr-7121861565"},            {name:"Vova", img: "http://www.photosforclass.com/download/flickr-3753652218"},
            {name:"Vova1", img: "http://www.photosforclass.com/download/flickr-14435096036"},
            {name:"Vova2", img: "http://www.photosforclass.com/download/flickr-2182093741"},
            {name:"Vova3", img: "http://www.photosforclass.com/download/flickr-7121861565"}
]; 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds}    );    
});

app.post("/campgrounds", function(req, res){
    var name=req.body.name;
    var image=req.body.image;
    var newCampg={name: name, img: image};
    campgrounds.push(newCampg);
   res.redirect("/campgrounds"); 
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Yelp Camp server running"); 
});