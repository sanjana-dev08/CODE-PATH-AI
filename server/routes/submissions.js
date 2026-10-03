const express = require("express");
const { createSubmission, listSubmissions, completeSubmission } = require("../controllers/submissionController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);
router.get("/", listSubmissions);
router.post("/", createSubmission);
router.patch("/:id/complete", completeSubmission);
module.exports = router;
