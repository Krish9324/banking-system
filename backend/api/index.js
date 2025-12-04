const express = require("express");
const cors = require("cors");
const authRoutes = require("../src/routes/authRoutes");
const customerRoutes = require("../src/routes/customerRoutes");
const bankerRoutes = require("../src/routes/bankerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Bank API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/banker", bankerRoutes);

// Export the Express app as a serverless function
module.exports = app;

