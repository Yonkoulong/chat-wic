const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const directSchema = new Schema(
  {
    messageFrom: { type: Schema.Types.ObjectId, ref: "User", required : false },
    messageTo: { type: Schema.Types.ObjectId, ref: "User", required : false },
    organizeId : {
      type : String,
      required : true
    },
    userIds : {
      type : Array,
      required : false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Direct", directSchema);
