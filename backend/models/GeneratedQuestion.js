const mongoose = require("mongoose");

const generatedQuestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  skill: String,
  question: String,
  expectedKeywords: [String],
  status: {
    type: String,
    enum: ["Pending", "Attempted"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("GeneratedQuestion", generatedQuestionSchema);
