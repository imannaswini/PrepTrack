const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// DEBUG LOGGING
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));

app.get("/", (req, res) => {
  res.send("PrepTrack API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});