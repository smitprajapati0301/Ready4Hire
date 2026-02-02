import express from "express";
import User from "../models/User.js";
import verifyFirebaseToken from "../middlewares/auth.js";

const router = express.Router();

// POST /api/users/create - Create a new user (called after signup)
router.post("/create", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, name, email, phone } = req.body;

    // Verify the uid in token matches the uid in body
    if (req.user.uid !== uid) {
      return res.status(403).json({ message: "UID mismatch" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      uid,
      name,
      email,
      phone,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user", error: err.message });
  }
});

// GET /api/users/:uid - Fetch user profile
router.get("/:uid", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;

    // Verify the uid in token matches the uid in params
    if (req.user.uid !== uid) {
      return res.status(403).json({ message: "UID mismatch" });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

export default router;
