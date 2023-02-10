const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const organizeSchema = new Schema(
  {
    organizeName: {
      type: String,
      required: false,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    active: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Organize", organizeSchema);
