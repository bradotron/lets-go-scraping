var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  author: {
    type: String,
    required: true,
  },

  comment: {
    type: String,
    required: true
  },

  date: { 
    type: Date, default: Date.now 
  },
});

var Comment = mongoose.model("Comment", commentSchema);

// Export the Comment model
module.exports = Comment;
