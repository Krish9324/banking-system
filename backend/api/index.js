const express = require("express");
const cors = require("cors");
const authRoutes = require("../src/routes/authRoutes");
const customerRoutes = require("../src/routes/customerRoutes");
const bankerRoutes = require("../src/routes/bankerRoutes");

const app = express();

// CORS configuration - Allow your frontend Vercel URL
const corsOptions = {
  origin: [
    "https://banking-system-pearl.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Bank API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/banker", bankerRoutes);

// Export the Express app as a serverless function
module.exports = app;

