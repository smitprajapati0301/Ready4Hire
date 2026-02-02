import express from "express";
import upload from "../middlewares/upload.js";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import Resume from "../models/Resume.js";


const router = express.Router();

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // Import groq.js HERE - after dotenv.config() has run
    const groq = (await import("../config/groq.js")).default;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // PDF → Text
    const pdfBytes = new Uint8Array(fs.readFileSync(req.file.path));
    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      text += strings.join(" ") + "\n";
    }

    // AI Prompt
    const prompt = `
You are a senior career mentor who reviews resumes every day.

Mindset rules:
- Do NOT assume anything that is not explicitly missing.
- Do NOT guess or hallucinate missing sections.
- Only list something in "missing" if it is clearly NOT present in the resume text.
- If the resume mentions hackathons, achievements, projects, or goals in any form,
  you MUST NOT mark them as missing.
- Base every decision strictly on what appears in the resume text.

Analyze the resume below:

${text}

Now return ONLY valid JSON in the exact format below.
No explanations. No markdown. No extra text.

{
  "name": "",
  "email": "",
  "skills": [],
  "projects": [],
  "education": [],
  "experience": [],
  "atsScore": 0,
  "missing": [],
  "suggestions": []
}

Rules for fields:

- "atsScore": number between 0–100.
  Consider:
  - Education (marks / CGPA if present)
  - Skills & relevance
  - Projects / experience
  - Resume clarity
  - Domain readiness
  Adjust fairly based on the person’s stage.

- "missing":
  - Include ONLY sections that are truly absent.
  - If hackathons are mentioned anywhere, DO NOT list "Hackathons" or "Achievements".
  - If an objective or summary exists in any form, DO NOT list "Career objective".

- "suggestions":
  - Must be human and mentor-like.
  - Must relate to what actually exists or is truly missing.
  - Do not contradict the resume content.

Output ONLY the JSON object.
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

    const response = result.choices[0].message.content;

    const clean = response.replace(/```json|```/g, "").trim();
    const aiResult = JSON.parse(clean);

    const normalizeArray = (value) => (Array.isArray(value) ? value : []);

    const normalizeProjects = normalizeArray(aiResult.projects).map((item) => {
      if (typeof item === "string") {
        return { name: item };
      }
      return item;
    });

    const normalizeEducation = normalizeArray(aiResult.education).map((item) => {
      if (typeof item === "string") {
        return { institution: item };
      }
      // Convert dates array to string if needed
      if (Array.isArray(item.dates)) {
        item.dates = item.dates.join(" - ");
      }
      return item;
    });

    const normalizeExperience = normalizeArray(aiResult.experience).map((item) => {
      if (typeof item === "string") {
        return { company: item, description: [] };
      }
      return item;
    });

    const saved = await Resume.create({
      ...aiResult,
      userId: req.user.uid, // Add Firebase UID
      projects: normalizeProjects,
      education: normalizeEducation,
      experience: normalizeExperience,
      rawText: text,
    });
    // after you save to MongoDB and before res.json(...)
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });


    res.json(saved);

    console.log(aiResult)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Processing failed", error: error.message });
  }
});

export default router;
