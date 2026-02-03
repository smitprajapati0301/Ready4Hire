import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { FcGoogle } from "react-icons/fc";
import { LogoWithWordmark } from "../components/ui/Logo";

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
    <div className="min-h-screen bg-linear-to-br from-[#0C2C55] via-[#296374] to-[#0C2C55] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#629FAD]/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-[#296374]/20 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="relative bg-white/10 backdrop-blur-lg border-2 border-[#629FAD]/30 rounded-3xl shadow-2xl p-8 w-full max-w-md hover:border-[#629FAD]/50 transition-all duration-300">
        <div className="mb-6 flex justify-center">
          <LogoWithWordmark iconSize={48} />
        </div>
        <p className="text-center text-[#EDEDCE]/80 mb-8">Welcome back</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#EDEDCE] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-[#629FAD]/30 rounded-lg focus:ring-2 focus:ring-[#629FAD] focus:border-[#629FAD] text-white placeholder:text-[#EDEDCE]/50 transition-all duration-200"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#EDEDCE] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-[#629FAD]/30 rounded-lg focus:ring-2 focus:ring-[#629FAD] focus:border-[#629FAD] text-white placeholder:text-[#EDEDCE]/50 transition-all duration-200"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-[#629FAD] to-[#296374] hover:from-[#7bb6c3] hover:to-[#3a7a8a] disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-[#629FAD]/50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#629FAD]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-[#EDEDCE]/60">or continue with</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-[#629FAD]/30 rounded-lg hover:bg-white/20 hover:border-[#629FAD]/50 disabled:bg-white/5 transition-all duration-200"
        >
          <FcGoogle size={20} />
          <span className="text-[#EDEDCE] font-medium">Google</span>
        </button>

        <p className="text-center text-sm text-[#EDEDCE]/80 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-[#629FAD] hover:text-[#7bb6c3] font-semibold transition-colors duration-200"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
