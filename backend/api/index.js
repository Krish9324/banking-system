const express = require("express");
const cors = require("cors");
const authRoutes = require("../src/routes/authRoutes");
const customerRoutes = require("../src/routes/customerRoutes");
const bankerRoutes = require("../src/routes/bankerRoutes");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "https://banking-system-pearl.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ];
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(null, true); 
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

app.options("*", cors(corsOptions));

app.use(cors(corsOptions));

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
module.exports = app;

