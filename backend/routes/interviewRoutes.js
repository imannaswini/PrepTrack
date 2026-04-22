const router = require("express").Router();
const GeneratedQuestion = require("../models/GeneratedQuestion");
const Resume = require("../models/Resume");
const auth = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const QUESTION_BANK = {
  "React": [
    { q: "What is Virtual DOM?", k: ["virtual", "dom", "rendering", "fast", "diffing"] },
    { q: "Explain useEffect hook", k: ["side effects", "lifecycle", "dependency", "array"] },
    { q: "Difference between state and props", k: ["mutable", "immutable", "parent", "component"] }
  ],
  "Node.js": [
    { q: "What is middleware?", k: ["function", "request", "response", "cycle", "next"] },
    { q: "Explain event loop", k: ["single threaded", "non-blocking", "callback", "stack"] },
    { q: "Why use Express?", k: ["framework", "routing", "minimal", "easy"] }
  ],
  "MongoDB": [
    { q: "What is indexing?", k: ["search", "speed", "performance", "binary tree"] },
    { q: "Explain aggregation", k: ["pipeline", "process", "data", "stage"] },
    { q: "Difference between SQL and MongoDB", k: ["relational", "document", "schema", "flexible"] }
  ],
  "JavaScript": [
    { q: "What are closures?", k: ["lexical", "scope", "function", "inner", "outer"] },
    { q: "Explain Promises", k: ["asynchronous", "resolve", "reject", "pending"] },
    { q: "What is 'this' keyword?", k: ["context", "object", "execution", "global"] }
  ],
  "Java": [
    { q: "What is JVM?", k: ["virtual machine", "bytecode", "platform", "independent"] },
    { q: "Explain OOP principles", k: ["inheritance", "encapsulation", "polymorphism", "abstraction"] },
    { q: "Interface vs Abstract Class", k: ["multiple", "inheritance", "abstract", "method"] }
  ],
  "Python": [
    { q: "What are decorators?", k: ["modify", "function", "wrapper", "syntax"] },
    { q: "Explain generators", k: ["yield", "iterator", "memory", "efficient"] },
    { q: "List comprehensions", k: ["shorthand", "create", "list", "loop"] }
  ],
  "SQL": [
    { q: "What are JOINS?", k: ["inner", "left", "right", "combine", "rows"] },
    { q: "Primary Key vs Foreign Key", k: ["unique", "identifier", "reference", "table"] },
    { q: "What is Normalization?", k: ["redundancy", "database", "organize", "dependency"] }
  ],
  "HTML": [
    { q: "What are semantic tags?", k: ["meaning", "article", "section", "header", "footer"] },
    { q: "HTML5 new features", k: ["video", "audio", "canvas", "storage"] },
    { q: "Box Model in HTML/CSS", k: ["margin", "border", "padding", "content"] }
  ],
  "CSS": [
    { q: "Explain Flexbox", k: ["layout", "axis", "alignment", "distribute"] },
    { q: "CSS Specificity", k: ["selector", "weight", "important", "cascade"] },
    { q: "What is Responsive Design?", k: ["media query", "breakpoints", "flexible", "viewport"] }
  ],
  "Express": [
    { q: "What is routing in Express?", k: ["url", "path", "endpoint", "handler"] },
    { q: "Error handling in Express", k: ["middleware", "err", "catch", "next"] },
    { q: "Serving static files", k: ["express.static", "public", "assets"] }
  ]
};

router.post("/generate", auth, async (req, res) => {
  console.log("[DEBUG] Generation start for user:", req.user);
  try {
    const userId = new mongoose.Types.ObjectId(req.user);
    const resume = await Resume.findOne({ user: userId });
    
    if (!resume) {
      console.log("[DEBUG] Resume not found for user:", userId);
      return res.status(404).json({ msg: "Please upload resume first" });
    }

    console.log("[DEBUG] Found resume with skills:", resume.skills);

    // Clear existing generated questions for fresh generation
    await GeneratedQuestion.deleteMany({ user: userId });

    const newQuestions = [];
    resume.skills.forEach(skill => {
      if (QUESTION_BANK[skill]) {
        QUESTION_BANK[skill].forEach(item => {
          newQuestions.push({
            user: userId,
            skill: skill,
            question: item.q,
            expectedKeywords: item.k
          });
        });
      }
    });

    if (newQuestions.length === 0) {
      console.log("[DEBUG] No skills matched question bank");
      return res.status(400).json({ msg: "No matching skills found in question bank. Try uploading a resume with React, Node.js, etc." });
    }

    console.log("[DEBUG] Inserting", newQuestions.length, "questions");
    const saved = await GeneratedQuestion.insertMany(newQuestions);
    res.json(saved);
  } catch (error) {
    console.error("[DEBUG] Generation Error:", error);
    res.status(500).json({ msg: "Generation failed: " + error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);
    const questions = await GeneratedQuestion.find({ user: userId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
