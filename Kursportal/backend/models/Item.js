const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
