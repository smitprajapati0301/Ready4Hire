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
You are an ATS resume analyzer.

From the resume text below, extract:
- name
- email
- skills (array)
- projects (array or null)
- education (array or null)
- experience (array or null)

Then:
- Give ATS score (0–100)
- List missing sections
- Give 3 improvement suggestions

Return ONLY valid JSON in this format:

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

Resume Text:
${text}
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

    const saved = await Resume.create({
      ...aiResult,
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
