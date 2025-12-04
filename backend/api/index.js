const express = require("express");
const cors = require("cors");
const authRoutes = require("../src/routes/authRoutes");
const customerRoutes = require("../src/routes/customerRoutes");
const bankerRoutes = require("../src/routes/bankerRoutes");

const app = express();

// CORS configuration - More permissive for Vercel serverless
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "https://banking-system-pearl.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ];
    
    // Allow if origin is in list, or allow all for now (can restrict later)
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for debugging - restrict in production
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

// Handle preflight requests FIRST (before CORS middleware)
app.options("*", cors(corsOptions));

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// Add manual CORS headers as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "https://banking-system-pearl.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ];
  
  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production")) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  
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

// Export the Express app as a serverless function
module.exports = app;

