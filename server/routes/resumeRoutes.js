import express from "express";
import upload from "../middlewares/upload.js";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import Resume from "../models/Resume.js";

const router = express.Router();

router.post("/upload", upload.single("resume"), async (req, res) => {
  let uploadedFilePath = null;

  try {
    const groq = (await import("../config/groq.js")).default;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    uploadedFilePath = req.file.path;

    if (!uploadedFilePath || !fs.existsSync(uploadedFilePath)) {
      return res.status(500).json({
        message: "Uploaded file was not found on server",
      });
    }

    // =========================
    // PDF → TEXT
    // =========================
    const pdfBytes = new Uint8Array(
      await fs.promises.readFile(uploadedFilePath)
    );

    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      text += strings.join(" ") + "\n";
    }

    // =========================
    // AI PROMPT
    // =========================
    const prompt = `
You are a senior career mentor who reviews resumes every day.

Analyze the resume below:

${text}

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
`;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    const response = result.choices[0].message.content;

    // =========================
    // CLEAN AI RESPONSE
    // =========================
    const clean = response.replace(/```json|```/g, "").trim();

    // Extract JSON safely
    const jsonStart = clean.indexOf("{");
    const jsonEnd = clean.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Invalid AI response:", clean);
      return res.status(500).json({
        message: "AI response format error",
      });
    }

    const jsonString = clean.slice(jsonStart, jsonEnd);

    let aiResult;

    try {
      aiResult = JSON.parse(jsonString);
    } catch (err) {
      console.error("JSON Parse Error:", jsonString);
      return res.status(500).json({
        message: "Failed to parse AI response",
      });
    }

    // =========================
    // NORMALIZE DATA
    // =========================
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
      if (Array.isArray(item.dates)) {
        item.dates = item.dates.join(" - ");
      }
      return item;
    });

    const normalizeExperience = normalizeArray(aiResult.experience).map(
      (item) => {
        if (typeof item === "string") {
          return { company: item, description: [] };
        }
        return item;
      }
    );

    // =========================
    // SAVE TO DATABASE
    // =========================
    const saved = await Resume.create({
      ...aiResult,
      userId: req.user.uid,
      projects: normalizeProjects,
      education: normalizeEducation,
      experience: normalizeExperience,
      rawText: text,
    });

    res.json(saved);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Processing failed",
      error: error.message,
    });
  } finally {
    // Delete uploaded file
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlink(uploadedFilePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }
  }
});

// =========================
// GET USER RESUMES
// =========================
router.get("/user", async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.uid }).sort({
      createdAt: -1,
    });

    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
});

export default router;