import dotenv from "dotenv";
dotenv.config(); // must be FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/InterviewRoutes.js";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("AI Career Coach API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
