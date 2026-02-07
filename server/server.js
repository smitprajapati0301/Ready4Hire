import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/InterviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import verifyFirebaseToken from "./middlewares/auth.js";

const app = express();


// ✅ Middleware
app.use(cors({
  origin: "*" // Later change to your Vercel URL for security
}));

app.use(express.json());


// ✅ Connect Database
connectDB();


// ✅ Health Route (IMPORTANT for Render testing)
app.get("/", (req, res) => {
  res.send("AI Career Coach API is running...");
});


// ✅ Public Routes
app.use("/api/users", userRoutes);


// ✅ Protected Routes (Require Firebase Token)
app.use("/api/resume", verifyFirebaseToken, resumeRoutes);
app.use("/api/interview", verifyFirebaseToken, interviewRoutes);



// ✅ VERY IMPORTANT — Use Render's PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});