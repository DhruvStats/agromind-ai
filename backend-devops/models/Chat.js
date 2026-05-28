const mongoose = require("mongoose");

// ✅ Define schema correctly
const chatSchema = new mongoose.Schema({
  question: String,
  answer: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Export model correctly
module.exports = mongoose.model("Chat", chatSchema);
