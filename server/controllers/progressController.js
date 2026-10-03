const Progress = require("../models/Progress");
const Submission = require("../models/Submission");
const { quizBank } = require("./quizBank");

const shuffle = (items) => {
	const shuffled = [...items];
	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}
	return shuffled;
};

const getProgress = async (req, res) => {
	const [submissions, progress] = await Promise.all([
		Submission.find({ userId: req.user._id }).sort({ createdAt: 1 }).lean(),
		Progress.findOne({ userId: req.user._id }).lean(),
	]);
	const now = new Date();
	const days = Array.from({ length: 7 }, (_, offset) => {
		const day = new Date(now);
		day.setDate(now.getDate() - (6 - offset));
		const key = day.toDateString();
		const count = submissions.filter((item) => new Date(item.createdAt).toDateString() === key).length;
		return { day: day.toLocaleDateString("en", { weekday: "short" }), attempted: count, completed: submissions.filter((item) => item.status === "completed" && new Date(item.createdAt).toDateString() === key).length };
	});
	const topics = ["Variables & Data Types", "Operators", "Conditions", "Loops", "Strings", "Arrays/Lists", "Functions", "Recursion", "Searching & Sorting", "Mixed Logic"];
	const topicPerformance = topics.map((topic) => {
		const attempts = (progress?.quizAttempts || []).filter((item) => item.topic === topic);
		return { topic, score: attempts.length ? Math.round(attempts.filter((item) => item.correct).length / attempts.length * 100) : 0, attempts: attempts.length };
	});
	const successfulDays = new Set(submissions.map((item) => new Date(item.createdAt).toDateString()));
	let streak = 0;
	for (let index = 0; index < 365; index += 1) {
		const date = new Date(now);
		date.setDate(now.getDate() - index);
		if (!successfulDays.has(date.toDateString())) break;
		streak += 1;
	}
	const todayKey = now.toDateString();
	const today = submissions.filter((item) => new Date(item.createdAt).toDateString() === todayKey).length;
	const quizAttempts = progress?.quizAttempts || [];
	const quizCorrect = quizAttempts.filter((item) => item.correct).length;
	const attempted = submissions.length;
	const completed = submissions.filter((item) => item.status === "completed").length;
	const successRate = attempted ? Math.round(completed / attempted * 100) : 0;
	return res.json({
		success: true,
		message: "Learning progress",
		data: {
			stats: { attempted, completed, submissions: attempted, successRate, currentStreak: streak, todayProgress: today, quizAttempts: quizAttempts.length, quizCorrect },
			sevenDayProgress: days,
			dailyProgress: days,
			topicPerformance,
		},
	});
};

const startQuiz = async (req, res) => {
	let progress = await Progress.findOne({ userId: req.user._id });
	if (!progress) {
		try {
			progress = await Progress.create({ userId: req.user._id });
		} catch (error) {
			if (error.code !== 11000) throw error;
			progress = await Progress.findOne({ userId: req.user._id });
		}
	}

	for (let attempt = 0; attempt < 3; attempt += 1) {
		const seen = progress.seenQuizQuestionIds || [];
		const unseen = quizBank.filter((item) => !seen.includes(item.id));
		if (!unseen.length) {
			return res.status(409).json({ success: false, message: "You have completed all questions in this quiz pool. New questions will be added soon." });
		}
		const questions = shuffle(unseen).slice(0, 10);
		const reserved = await Progress.findOneAndUpdate(
			{ _id: progress._id, seenQuizQuestionIds: seen },
			{ $addToSet: { seenQuizQuestionIds: { $each: questions.map((item) => item.id) } } },
			{ returnDocument: "after" },
		);
		if (reserved) {
			return res.json({
				success: true,
				message: `Started a quiz with ${questions.length} new questions`,
				data: {
					questions: questions.map(({ id, topic, kind, question: prompt, options }) => ({ id, topic, kind, question: prompt, options })),
					total: questions.length,
					remainingQuestions: quizBank.length - reserved.seenQuizQuestionIds.length,
				},
			});
		}
		progress = await Progress.findById(progress._id);
	}
	return res.status(409).json({ success: false, message: "Another quiz was started at the same time. Please try again." });
};

const saveQuizAttempt = async (req, res) => {
	const { questionId, answer } = req.body;
	if (!questionId || typeof answer !== "string") {
		return res.status(400).json({ success: false, message: "Choose an answer before submitting" });
	}
	const quizQuestion = quizBank.find((item) => item.id === questionId);
	if (!quizQuestion) return res.status(404).json({ success: false, message: "Quiz question not found" });
	const isCorrect = answer === quizQuestion.answer;
	const progress = await Progress.findOneAndUpdate(
		{ userId: req.user._id, seenQuizQuestionIds: questionId, "quizAttempts.questionId": { $ne: questionId } },
		{ $push: { quizAttempts: { questionId, topic: quizQuestion.topic, question: quizQuestion.question, answer, correct: isCorrect, date: new Date() } } },
		{ returnDocument: "after" },
	);
	if (!progress) {
		return res.status(409).json({ success: false, message: "This question was already answered or is not part of your quiz" });
	}
	return res.status(201).json({
		success: true,
		message: "Quiz answer saved",
		data: { correct: isCorrect, correctAnswer: quizQuestion.answer, explanation: quizQuestion.explanation, quizAttempts: progress.quizAttempts.length },
	});
};

module.exports = { getProgress, startQuiz, saveQuizAttempt };
