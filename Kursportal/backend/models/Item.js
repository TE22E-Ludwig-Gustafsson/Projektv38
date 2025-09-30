const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date },         
  teacher: { type: String }
});

module.exports = mongoose.model("Item", ItemSchema);
