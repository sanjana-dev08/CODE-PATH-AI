const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
	date: { type: Date, default: Date.now },
	questionId: { type: String },
	topic: { type: String, required: true },
	question: { type: String, required: true },
	answer: { type: String, required: true },
	correct: { type: Boolean, required: true },
}, { _id: false });

const progressSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
	quizAttempts: { type: [quizAttemptSchema], default: [] },
	seenQuizQuestionIds: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);
