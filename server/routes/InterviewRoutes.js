import express from "express";
import Resume from "../models/Resume.js";
import InterviewLog from "../models/InterviewLog.js";

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    // Import groq.js HERE - after dotenv.config() has run
    const groq = (await import("../config/groq.js")).default;

    const { resumeId, domain } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const prompt = `
You are an interview bot.

Candidate details:
Name: ${resume.name}
Skills: ${resume.skills.join(", ")}
Projects: ${resume.projects?.join(", ")}

Domain: ${domain}

Ask the FIRST interview question suitable for this domain.
Return only the question text.
`;

    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const question = result.choices[0].message.content.trim();

    const log = await InterviewLog.create({
      resumeId,
      domain,
      questions: [question],
      answers: [],
    });

    res.json({
      interviewId: log._id,
      question,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to start interview" });
  }
});


router.post("/answer", async (req, res) => {
  try {
    const groq = (await import("../config/groq.js")).default;

    const { interviewId, answer } = req.body;

    const log = await InterviewLog.findById(interviewId);
    if (!log) {
      return res.status(404).json({ message: "Interview not found" });
    }

    log.answers.push(answer);

    const history = log.questions.map((q, i) => {
      return `Q: ${q}\nA: ${log.answers[i] || ""}`;
    }).join("\n\n");

    const prompt = `
You are conducting a professional interview.

Conversation so far:
${history}

Ask the NEXT interview question.
Return only the question text.
`;

    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-70b-versatile",
    });

    const nextQuestion = result.choices[0].message.content.trim();

    log.questions.push(nextQuestion);
    await log.save();

    res.json({ question: nextQuestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process answer" });
  }
});

export default router;
