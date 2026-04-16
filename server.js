const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// routes import
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");

dotenv.config();

// connect database
connectDB();

const app = express();

// 🔥 ✅ CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: "*",   // अभी सबको allow कर रहे हैं (best for testing)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// middlewares
app.use(express.json());

// static folder
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});