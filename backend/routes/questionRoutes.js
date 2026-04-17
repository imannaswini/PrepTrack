const router = require("express").Router();
const Question = require("../models/Question");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const data = await Question.create({
    ...req.body,
    user: req.user
  });
  res.json(data);
});

router.get("/", auth, async (req, res) => {
  const data = await Question.find({ user: req.user });
  res.json(data);
});

router.put("/:id", auth, async (req, res) => {
  const data = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
});

router.delete("/:id", auth, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

router.get("/stats/all", auth, async (req, res) => {
  const total = await Question.countDocuments({ user: req.user });
  const solved = await Question.countDocuments({
    user: req.user,
    status: "Solved"
  });
  const pending = await Question.countDocuments({
    user: req.user,
    status: "Pending"
  });

  res.json({ total, solved, pending });
});

module.exports = router;