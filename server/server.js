const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const allowedOrigins = new Set([
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json());

const authRoutes = require("./routes/auth");
const problemRoutes = require("./routes/problems");
const aiRoutes = require("./routes/ai");
const submissionRoutes = require("./routes/submissions");
const progressRoutes = require("./routes/progress");
const { notFound, errorHandler } = require("./middleware/errorHandler");

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/progress", progressRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CodePath AI server is running",
    data: {},
  });
});
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (require.main === module) {
  start().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = app;