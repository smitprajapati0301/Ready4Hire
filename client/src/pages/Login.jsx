import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { FcGoogle } from "react-icons/fc";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Sign in with email and password
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Get ID token
      const idToken = await firebaseUser.getIdToken();

      // Verify user exists in backend
      const response = await fetch(
        `${BACKEND_URL}/api/users/${firebaseUser.uid}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (!response.ok) {
        throw new Error("User not found. Please sign up first.");
      }

      localStorage.setItem("idToken", idToken);

      // Use window.location for immediate navigation
      window.location.href = "/resume";
    } catch (err) {
      console.error(err);
      // Handle Firebase auth errors with user-friendly messages
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else if (err.code === "auth/user-disabled") {
        setError("This account has been disabled.");
      } else if (err.message?.includes("User not found")) {
        setError("No account found with this email. Please sign up first.");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Verify user exists in backend
      const response = await fetch(
        `${BACKEND_URL}/api/users/${firebaseUser.uid}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (!response.ok) {
        throw new Error("User not found. Please sign up first.");
      }

      const userData = await response.json();
      console.log("User found in MongoDB:", userData);

      localStorage.setItem("idToken", idToken);

      console.log("Redirecting to resume...");
      // Use window.location for immediate navigation that bypasses ProtectedRoute check
      window.location.href = "/resume";
    } catch (err) {
      console.error("Google login error:", err);
      setLoading(false);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Login cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups and try again.");
      } else if (err.message?.includes("User not found")) {
        setError("No account found. Please sign up first with Google.");
      } else {
        setError("Google login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
          Ready4Hire
        </h1>
        <p className="text-center text-slate-600 mb-8">Welcome back</p>

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Your password"
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
            {loading ? "Logging in..." : "Login"}
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
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:bg-slate-100 transition"
        >
          <FcGoogle size={20} />
          <span className="text-slate-700 font-medium">Google</span>
        </button>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
