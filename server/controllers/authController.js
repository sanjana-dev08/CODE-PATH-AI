const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const createToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing from server/.env");
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: publicUser(user),
        token: createToken(user),
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }
    console.error("REGISTER ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not create account",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    const user = email && await User.findOne({ email });
    if (!user || !password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Email or password is incorrect" });
    }
    return res.json({
      success: true,
      message: "Login successful",
      data: { user: publicUser(user), token: createToken(user) },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Could not log in" });
  }
};

const getMe = async (req, res) => res.json({
  success: true,
  message: "Authenticated user",
  data: { user: publicUser(req.user) },
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};