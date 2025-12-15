const mongoose = require('mongoose');
const plm = require('passport-local-mongoose').default;

const userSchema = mongoose.Schema({
  username : String,
  name : String,
  email : String,
  password : String,
  profileImage : String,
  contact : Number,
  boards : {
    type : Array,
    default : []
  }
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema)