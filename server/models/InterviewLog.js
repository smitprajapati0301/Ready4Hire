import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Firebase UID
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
    domain: String,
    questions: [String],
    answers: [String],
    feedback: String,
  },
  { timestamps: true }
);

export default mongoose.model("InterviewLog", interviewSchema);
