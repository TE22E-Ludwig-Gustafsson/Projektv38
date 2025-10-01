const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date },         
  teacher: { type: String },
  description: { type: String, default: '' }
});

module.exports = mongoose.model("Item", ItemSchema);
