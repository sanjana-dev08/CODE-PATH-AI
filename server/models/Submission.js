const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
	problemTitle: { type: String, required: true },
	code: { type: String, required: true },
	language: { type: String, default: "javascript" },
	status: { type: String, enum: ["submitted", "completed"], default: "submitted" },
	analysis: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
