const Problem = require("../models/Problem");

const problemSets = {
	Basic: ["Even/Odd", "Largest of Two", "Largest of Three", "Positive/Negative/Zero", "Sum of First N Natural Numbers", "Multiplication Table", "Factorial", "Reverse Number", "Count Digits", "Palindrome"],
	Intermediate: ["Prime Number", "Primes in Range", "Fibonacci", "GCD/LCM", "Sum of Digits", "Armstrong Number", "Count Vowels/Consonants/Digits/Spaces", "Second Largest in Array", "Remove Duplicates", "Frequency of Each Element"],
	Hard: ["Subarrays With Given Sum", "Longest Substring Without Repeating Characters", "Maximum Subarray Sum", "Missing Number 1..N", "Duplicate Elements", "Anagrams", "Binary Search", "Intersection of Two Arrays", "Two Sum", "Longest Palindromic Substring"],
};

const makeSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const catalog = Object.entries(problemSets).flatMap(([difficulty, titles]) => titles.map((title) => ({
	title,
	slug: makeSlug(title),
	difficulty,
	topic: title.includes("Array") || title.includes("array") ? "Arrays/Lists" : title.includes("String") || title.includes("Anagram") ? "Strings" : "Logic",
	prompt: `Solve the ${title.toLowerCase()} problem. Explain your approach, handle important edge cases, and write a clear solution.`,
	hint: "Start by writing down the inputs, expected output, and one small example.",
})));

const listProblems = async (req, res) => {
	let problems = await Problem.find().sort({ difficulty: 1, title: 1 }).lean();
	if (problems.length !== catalog.length) {
		await Problem.bulkWrite(catalog.map((problem) => ({
			updateOne: { filter: { slug: problem.slug }, update: { $setOnInsert: problem }, upsert: true },
		})));
		problems = await Problem.find().sort({ difficulty: 1, title: 1 }).lean();
	}
	return res.json({ success: true, message: "Practice problems", data: { problems } });
};

module.exports = { listProblems };
