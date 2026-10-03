const express = require("express");
const { listProblems } = require("../controllers/problemController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", protect, listProblems);
module.exports = router;
