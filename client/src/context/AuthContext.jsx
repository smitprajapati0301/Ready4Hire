import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Monitor Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setFirebaseUser(fbUser);

          // Get ID token and fetch user data from backend
          const idToken = await fbUser.getIdToken();

          try {
            const res = await axios.get(`${BACKEND_URL}/api/users/${fbUser.uid}`, {
              headers: { Authorization: `Bearer ${idToken}` },
            });
            setUser(res.data);
            localStorage.setItem("idToken", idToken);
          } catch (err) {
            // User not found in DB (not signed up yet)
            console.error("User fetch error:", err);
            setError("User not found in database. Please sign up.");
            setUser(null);
            localStorage.removeItem("idToken");
          }
        } else {
          setUser(null);
          setFirebaseUser(null);
          localStorage.removeItem("idToken");
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [BACKEND_URL]);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem("idToken");
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
