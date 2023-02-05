const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workPlaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkPlace", workPlaceSchema);
