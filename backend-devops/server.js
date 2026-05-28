const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

/* ✅ CRASH PROTECTION */
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
});

const app = express();

/* ✅ RATE LIMIT (ANTI SPAM) */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20
});
app.use("/api", limiter);

/* ✅ MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ ROUTES */
const queryRoutes = require("./routes/query");
app.use("/api", queryRoutes);

/* ✅ HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

/* ✅ DB CONNECT */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo error:", err.message));

/* ✅ ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("🚨 GLOBAL ERROR:", err.message);
  res.status(500).json({ answer: "❌ Server error" });
});

/* ✅ START SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});