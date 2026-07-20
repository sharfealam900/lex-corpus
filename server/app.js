import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import queryRoute from "./routes/query.route.js";
import articleRoute from "./routes/article.route.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Test Route
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is working",
  });
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/query", queryRoute);
app.use("/api/v1/article", articleRoute);

export default app;