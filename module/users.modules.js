const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: [String],
    default: [],
  },
  channels: {
    type: [String],
    default: [],
  },
  likedVideos: {
  type: [String],
  default: [],
}
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
