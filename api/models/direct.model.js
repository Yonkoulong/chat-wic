const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const directSchema = new Schema(
  {
    messageFrom: { type: Schema.Types.ObjectId, ref: "User" },
    messageTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Direct", directSchema);
