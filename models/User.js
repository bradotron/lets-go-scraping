var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: false
  },

  articles: [{
    type: Schema.Types.ObjectId,
    ref: "Article"
  }],

  comments: [{ 
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;