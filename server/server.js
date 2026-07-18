import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error");
    console.log(err.message);
  });