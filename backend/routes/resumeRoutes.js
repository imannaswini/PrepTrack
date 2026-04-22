const router = require("express").Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const pdf = typeof pdfParse === 'function' ? pdfParse : (pdfParse.default || pdfParse);
const Resume = require("../models/Resume");
const auth = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

console.log("Loaded updated resumeRoutes.js with robust pdf-parse import");

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    console.log("[DEBUG] Multer filter hit:", file.originalname);
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const SKILL_KEYWORDS = [
  "React", "Node.js", "MongoDB", "JavaScript", "Java", "Python", "SQL", "HTML", "CSS", "Express"
];

router.post("/upload", auth, upload.single("resume"), async (req, res) => {
  console.log("[DEBUG] Upload attempt start");
  console.log("[DEBUG] User ID from token:", req.user);

  try {
    if (!req.file) {
      console.error("[DEBUG] No file found in req.file");
      return res.status(400).json({ msg: "No file uploaded or invalid file field name." });
    }

    console.log("[DEBUG] Received file:", req.file.originalname, "size:", req.file.size);
    
    let text = "";
    try {
      console.log("[DEBUG] Invoking pdf-parse engine...");
      // Double check if pdf is indeed a function here
      if (typeof pdf !== 'function') {
         throw new Error("pdf-parse resolve failed: 'pdf' is still not a function");
      }
      const data = await pdf(req.file.buffer);
      text = data.text || "";
      console.log("[DEBUG] pdf-parse success. Text length:", text.length);
    } catch (parseErr) {
      console.error("[DEBUG] pdf-parse CRASHED:", parseErr);
      return res.status(422).json({ msg: "PDF parsing engine failed: " + parseErr.message });
    }

    const detectedSkills = SKILL_KEYWORDS.filter(skill => {
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
      return regex.test(text);
    });

    console.log("[DEBUG] Detected skills:", detectedSkills);

    const userId = new mongoose.Types.ObjectId(req.user);
    console.log("[DEBUG] Attempting MongoDB upsert for user:", userId);
    
    const resume = await Resume.findOneAndUpdate(
      { user: userId },
      {
        filename: req.file.originalname,
        skills: detectedSkills,
        extractedText: text
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log("[DEBUG] MongoDB operation success. Resume ID:", resume._id);
    res.json(resume);

  } catch (error) {
    console.error("[DEBUG] UNCAUGHT ERROR IN UPLOAD ROUTE:", error.stack);
    res.status(500).json({ msg: "Server Internal Error: " + error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: new mongoose.Types.ObjectId(req.user) });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
