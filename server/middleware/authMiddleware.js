const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
	try {
		const authorization = req.headers.authorization || "";
		const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
		if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
		if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.id).select("name email");
		if (!user) return res.status(401).json({ success: false, message: "Account not found" });
		req.user = user;
		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
			return res.status(401).json({ success: false, message: "Session expired. Please log in again" });
		}
		return res.status(500).json({ success: false, message: "Could not verify session" });
	}
};

module.exports = protect;
