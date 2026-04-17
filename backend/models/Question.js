const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: String,
  topic: String,
  difficulty: String,
  status: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);