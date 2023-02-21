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
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    organizeId: {
      type: Schema.Types.ObjectId,
      ref: "Organize",
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    userStatus: {
      type: String, // "Online - offline - busy - others"
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false, // ADMIN || STAFF
    },
    id: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
