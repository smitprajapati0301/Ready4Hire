import express from "express";
import Resume from "../models/Resume.js";
import InterviewLog from "../models/InterviewLog.js";

const router = express.Router();
const MAX_QUESTIONS = 8;

// START INTERVIEW
router.post("/start", async (req, res) => {
  try {
    const groq = (await import("../config/groq.js")).default;
    const { resumeId, domain } = req.body;

    if (!resumeId || resumeId === "undefined") {
      return res.status(400).json({
        message: "resumeId is required. Upload a resume first.",
      });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Verify resume belongs to this user
    if (resume.userId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied" });
    }

    const prompt = `
You are an interview bot.

Candidate Profile:
Name: ${resume.name}
Email: ${resume.email}
Skills: ${resume.skills.join(", ")}
Projects: ${resume.projects?.join(", ") || "None"}
Education: ${resume.education?.join(", ") || "None"}
Experience: ${resume.experience?.join(", ") || "None"}

Domain: ${domain}

Ask the FIRST interview question that is directly based on this resume.
Return only the question text.
`;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    const question = result.choices[0].message.content.trim();

    const log = await InterviewLog.create({
      userId: req.user.uid,
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

// ANSWER INTERVIEW
router.post("/answer", async (req, res) => {
  try {
    const groq = (await import("../config/groq.js")).default;
    const { interviewId, answer } = req.body;

    const log = await InterviewLog.findById(interviewId);
    if (!log) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Verify interview belongs to this user
    if (log.userId !== req.user.uid) {
      return res.status(403).json({ message: "Access denied" });
    }

    const resume = await Resume.findById(log.resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    log.answers.push(answer);

    // END CONDITION
    if (log.questions.length >= MAX_QUESTIONS) {
      const summary = log.questions
        .map((q, i) => `Q: ${q}\nA: ${log.answers[i] || ""}`)
        .join("\n\n");

      const prompt = `
You are a strict senior technical interviewer.

Below is the full interview transcript:

${summary}

Rules:
- If the candidate repeats the question instead of answering, treat it as a failure.
- If an answer is vague, generic, or lacks technical substance, mark it as weak.
- If an answer shows real depth, praise it specifically.
- You MUST reference exact answers from the transcript.
- Do NOT be polite by default. Be honest and critical like a real interviewer.
- Assume this is a real hiring decision.

Output format:

Overall Performance:
- One paragraph.
- Clearly state whether the candidate would PASS or FAIL this interview.

Strengths:
- Bullet points referencing specific answers.

Weaknesses:
- Bullet points referencing specific answers.
- Explicitly mention if the candidate avoided answering or repeated questions.

Score (0–10):
- Single number only.

Improvement Tips:
- 3 concrete, actionable tips.
`;

      const result = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
      });

      const feedback = result.choices[0].message.content.trim();

      log.feedback = feedback;
      await log.save();

      return res.json({
        done: true,
        feedback,
      });
    }

    // OTHERWISE ASK NEXT QUESTION
    const history = log.questions
      .map((q, i) => `Q: ${q}\nA: ${log.answers[i] || ""}`)
      .join("\n\n");

    const prompt = `
You are a professional technical interviewer.

Candidate profile:
Name: ${resume.name}
Skills: ${resume.skills.join(", ")}
Projects: ${resume.projects?.join(", ") || "None"}
Domain: ${log.domain}

Conversation so far:
${history || "None"}

Guidelines:
- Adapt difficulty based on the candidate’s last answer.
- If the answer is weak, unclear, or incorrect:
  - Ask simpler, guiding questions.
  - Help the candidate express basic understanding.
- If the answer is strong and detailed:
  - Ask deeper, more technical follow-up questions.
  - Explore edge cases, trade-offs, and real-world scenarios.
- Do NOT punish weak candidates by jumping to very hard questions.
- Hard questions are for high-performing candidates and count as “bonus depth”.
- Maintain a professional and encouraging tone.
- Ask only ONE question at a time.

Ask the NEXT interview question.
Return only the question text.
`;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
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
