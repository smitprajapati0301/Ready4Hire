import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Create user with email and password
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Update profile with name
      await updateProfile(firebaseUser, { displayName: name });

      // Get ID token
      const idToken = await firebaseUser.getIdToken();

      // Create user in MongoDB
      const userResponse = await axios.post(
        `${BACKEND_URL}/api/users/create`,
        {
          uid: firebaseUser.uid,
          name,
          email,
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      // Store auth data
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("latestResumeId", "");

      // Small delay to ensure everything is synced
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use window.location for immediate navigation
      window.location.href = "/resume";
    } catch (err) {
      console.error(err);
      // Handle Firebase auth errors with user-friendly messages
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters long.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Email/password accounts are not enabled. Please contact support.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Try to create user in MongoDB
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/users/create`,
          {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email,
          },
          {
            headers: { Authorization: `Bearer ${idToken}` },
          }
        );
        console.log("User created/exists in MongoDB:", response.data);
      } catch (err) {
        // User might already exist (409), that's okay
        if (err.response?.status !== 409) {
          console.error("Backend error:", err);
          throw err;
        }
        console.log("User already exists, continuing...");
      }

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("latestResumeId", "");

      // Small delay to ensure Firebase auth state is propagated
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log("Redirecting to resume...");
      // Use window.location for immediate navigation that bypasses ProtectedRoute check
      window.location.href = "/resume";
    } catch (err) {
      console.error("Google signup error:", err);
      setLoading(false);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign up cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups and try again.");
      } else {
        setError(err.message || "Failed to sign up with Google. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
          Ready4Hire
        </h1>
        <p className="text-center text-slate-600 mb-8">Create your account</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">or continue with</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:bg-slate-100 transition"
        >
          <FcGoogle size={20} />
          <span className="text-slate-700 font-medium">Google</span>
        </button>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
