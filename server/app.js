import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import queryRoute from "./routes/query.route.js";
import articleRoute from "./routes/article.route.js";
import settingRoute from "./routes/setting.route.js";
import practiceRoute from "./routes/practice.route.js";

const app = express();

// ==============================
// Middlewares
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==============================
// CORS
// ==============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://lex-corpus.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ==============================
// Test Route
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running Successfully",
  });
});

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is working",
  });
});

// ==============================
// Routes
// ==============================

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/query", queryRoute);
app.use("/api/v1/article", articleRoute);
app.use("/api/v1/settings", settingRoute);
app.use("/api/v1/practice", practiceRoute);

export default app;