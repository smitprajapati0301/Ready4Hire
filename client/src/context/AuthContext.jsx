import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import axios from "axios";
import {
  getUserProfileErrorMessage,
  isUserProfileMissingError,
} from "../utils/authErrors";

const AuthContext = createContext(null);
const USER_FETCH_RETRY_DELAYS = [0, 250, 750];

async function fetchUserProfile(backendUrl, uid, idToken) {
  let lastError = null;

  for (const delay of USER_FETCH_RETRY_DELAYS) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const res = await axios.get(`${backendUrl}/api/users/${uid}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      return res.data;
    } catch (err) {
      lastError = err;

      if (!isUserProfileMissingError(err) || delay === USER_FETCH_RETRY_DELAYS.at(-1)) {
        throw err;
      }
    }
  }

  throw lastError;
}

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
          setError(null);

          // Get ID token and fetch user data from backend
          const idToken = await fbUser.getIdToken();

          try {
            const userProfile = await fetchUserProfile(BACKEND_URL, fbUser.uid, idToken);
            setUser(userProfile);
            localStorage.setItem("idToken", idToken);
          } catch (err) {
            if (isUserProfileMissingError(err)) {
              console.warn("User profile lookup returned 404 for Firebase account:", fbUser.uid);
            } else {
              console.error("User fetch error:", err);
            }

            setError(getUserProfileErrorMessage(err));
            setUser(null);
            localStorage.removeItem("idToken");
          }
        } else {
          setUser(null);
          setFirebaseUser(null);
          setError(null);
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
