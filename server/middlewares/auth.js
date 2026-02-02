import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Initialize Firebase Admin (make sure FIREBASE_ADMIN_SDK env var is set)
const initializeAdmin = () => {
  if (!admin.apps.length) {
    try {
      let credentials;

      // Try to load from serviceAccountKey.json file first
      const keyPath = path.join(__dirname, "../serviceAccountKey.json");
      if (fs.existsSync(keyPath)) {
        const keyFile = fs.readFileSync(keyPath, "utf8");
        credentials = JSON.parse(keyFile);
        console.log("✅ Firebase Admin SDK initialized with credentials from serviceAccountKey.json");
      } else if (process.env.FIREBASE_ADMIN_SDK) {
        credentials = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
        console.log("✅ Firebase Admin SDK initialized with credentials from FIREBASE_ADMIN_SDK env");
      } else {
        console.error("❌ No Firebase credentials found (serviceAccountKey.json or FIREBASE_ADMIN_SDK env)");
        throw new Error("Firebase Admin SDK not configured");
      }

      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });
    } catch (err) {
      console.error("❌ Error initializing Firebase Admin SDK:", err.message);
      throw err;
    }
  }
};

initializeAdmin();

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid authorization header" });
    }

    const idToken = authHeader.slice(7); // Remove "Bearer " prefix

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || decodedToken.phone_number,
      };
      next();
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Authentication error" });
  }
};

export default verifyFirebaseToken;
