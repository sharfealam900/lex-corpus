import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoute from "./routes/auth.route.js";
import queryRoute from "./routes/query.route.js";
import articleRoute from "./routes/article.route.js";
import settingRoute from "./routes/setting.route.js";
import practiceRoute from "./routes/practice.route.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://lex-corpus.vercel.app",
];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "1mb",
}));
app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running Successfully",
  });
});

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is working",
  });
});

app.use("/api/v1/auth", authLimiter, authRoute);
app.use("/api/v1/query", queryRoute);
app.use("/api/v1/article", articleRoute);
app.use("/api/v1/settings", settingRoute);
app.use("/api/v1/practice", practiceRoute);

export default app;