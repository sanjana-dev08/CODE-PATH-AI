const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
	title: { type: String, required: true },
	slug: { type: String, required: true, unique: true },
	difficulty: { type: String, enum: ["Basic", "Intermediate", "Hard"], required: true },
	topic: { type: String, default: "Logic" },
	prompt: { type: String, required: true },
	hint: { type: String, default: "Break the problem into small steps." },
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);
