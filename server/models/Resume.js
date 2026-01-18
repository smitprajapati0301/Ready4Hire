import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    skills: [String],
    projects: [
      {
        name: String,
        technologies: [String],
        description: String,
        link: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        dates: String,
        details: String,
        location: String,
      },
    ],
    experience: [
      {
        company: String,
        title: String,
        dates: String,
        location: String,
        description: [String],
        link: String,
      },
    ],
    atsScore: Number,
    missing: [String],
    suggestions: [String],
    rawText: String,
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
