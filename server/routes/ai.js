const express = require("express");
const { tutor } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/tutor", protect, tutor);
module.exports = router;
