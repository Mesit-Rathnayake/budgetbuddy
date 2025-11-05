const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const goalRoutes = require("./routes/goalRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/goals", goalRoutes);

// Connect MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/budget-tracker";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
}).catch(err => console.log(err));


