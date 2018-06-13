var mongoose = require("mongoose");

var campgroudsSchema=new mongoose.Schema({
    name: String,
    price: String,
    img: String,
    descr: String,
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroudsSchema);