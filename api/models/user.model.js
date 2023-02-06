const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    lastName: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    userStatus: {
      type: String, // "Online - offline - busy - others"
      required: false,
    },
    avatar: {
      type: String,
      required: true,
    },
    role : {
      type : String,
      required : false, // ADMIN || STAFF
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
