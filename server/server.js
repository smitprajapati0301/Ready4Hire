import dotenv from "dotenv";
dotenv.config(); // must be FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/InterviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import verifyFirebaseToken from "./middlewares/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/users", userRoutes); // POST /create doesn't need token, GET /:uid needs token

// Protected routes (require Firebase token)
app.use("/api/resume", verifyFirebaseToken, resumeRoutes);
app.use("/api/interview", verifyFirebaseToken, interviewRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("AI Career Coach API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
