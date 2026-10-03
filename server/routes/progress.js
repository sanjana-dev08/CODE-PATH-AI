const express = require("express");
const { getProgress, startQuiz, saveQuizAttempt } = require("../controllers/progressController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);
router.get("/", getProgress);
router.post("/quiz/start", startQuiz);
router.post("/quiz", saveQuizAttempt);
module.exports = router;
