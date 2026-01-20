import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
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
