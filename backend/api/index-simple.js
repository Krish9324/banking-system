// SIMPLER CORS FIX - Use this if the main one doesn't work
// Replace the content of api/index.js with this if needed

const express = require("express");
const cors = require("cors");
const authRoutes = require("../src/routes/authRoutes");
const customerRoutes = require("../src/routes/customerRoutes");
const bankerRoutes = require("../src/routes/bankerRoutes");

const app = express();

// SIMPLEST CORS - Allow everything (restrict later)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Bank API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/banker", bankerRoutes);

module.exports = app;

