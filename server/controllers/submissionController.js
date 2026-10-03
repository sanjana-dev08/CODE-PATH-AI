const Submission = require("../models/Submission");
const Feedback = require("../models/Feedback");
const Problem = require("../models/Problem");

const createSubmission = async (req, res) => {
	const { problemId, problemTitle, code, language = "javascript" } = req.body;
	if (!problemTitle?.trim() || !code?.trim()) {
		return res.status(400).json({ success: false, message: "Choose a problem and write some code first" });
	}
	const problem = problemId ? await Problem.findById(problemId) : null;
	const analysis = code.trim().length < 20
		? "Your attempt is saved. Add the key steps of your solution, then check the inputs, edge cases, and expected output."
		: "Your attempt is saved. Trace it with a small example, verify an edge case, and check that each step matches the problem before marking it complete.";
	const submission = await Submission.create({
		userId: req.user._id,
		problemId: problem?._id,
		problemTitle: problem?.title || problemTitle.trim(),
		code,
		language,
		analysis,
	});
	await Feedback.create({ userId: req.user._id, submissionId: submission._id, message: analysis });
	return res.status(201).json({
		success: true,
		message: "Submission saved for review",
		data: { submission, analysis, execution: "Code is stored but not executed on the server." },
	});
};

const listSubmissions = async (req, res) => {
	const submissions = await Submission.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
	return res.json({ success: true, message: "Your submissions", data: { submissions } });
};

const completeSubmission = async (req, res) => {
	const submission = await Submission.findOneAndUpdate(
		{ _id: req.params.id, userId: req.user._id },
		{ status: "completed" },
		{ returnDocument: "after" },
	);
	if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });
	return res.json({ success: true, message: "Problem marked complete", data: { submission } });
};

module.exports = { createSubmission, listSubmissions, completeSubmission };
