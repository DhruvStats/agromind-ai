const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  text: String,
  response: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Query", querySchema);
