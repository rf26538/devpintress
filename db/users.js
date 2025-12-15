const mongoose = require('mongoose');
const plm = require('passport-local-mongoose').default;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  profileImage: String,
  contact: String,
  boards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board"
  }]
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
