import { createContext, useContext, useCallback, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as authSignOut,
  signInAnonymously,
} from "firebase/auth";
import { useRouter } from "next/router";

import { addANewUserExpenseDoc } from "../firebase/firestore";
import { auth } from "../firebase/firebase";

function guestSignInMessage(code) {
  if (
    code === "auth/admin-restricted-operation" ||
    code === "auth/operation-not-allowed"
  ) {
    return "Guest sign-in is disabled for this Firebase project. In the Firebase console: Authentication → Sign-in method → turn on Anonymous, then save.";
  }
  return "Could not start a guest session. Try again or sign in with email or Google.";
}

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestSignInError, setGuestSignInError] = useState(null);
  const router = useRouter();

  const clear = () => {
    setAuthUser(null);
    setIsLoading(false);
  };

  const authStateChanged = async (user) => {
    setIsLoading(true);
    if (!user) {
      clear();
      return;
    }

    if (user) {
      const displayLabel =
        user.displayName || user.email || "Guest";

      addANewUserExpenseDoc(user.uid, displayLabel);

      setAuthUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAnonymous: user.isAnonymous,
      });

      setIsLoading(false);
    }
  };

  const signOut = () =>
    authSignOut(auth).then(() => {
      clear();
      router.push("/");
    });

  const clearGuestSignInError = useCallback(() => setGuestSignInError(null), []);

  const signInAsGuest = useCallback(async () => {
    setGuestSignInError(null);
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      // Do not router.push here: onAuthStateChanged must run first so authUser
      // is set before /dashboard mounts. Index (or other pages) redirect via
      // useEffect when authUser becomes available.
      return true;
    } catch (err) {
      console.error("Anonymous sign-in failed:", err);
      setGuestSignInError(guestSignInMessage(err?.code));
      setIsLoading(false);
      return false;
    }
  }, []);

  // Listen for Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    signOut,
    signInAsGuest,
    guestSignInError,
    clearGuestSignInError,
  };
}

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
  signOut: async () => {},
  signInAsGuest: async () => {},
  guestSignInError: null,
  clearGuestSignInError: () => {},
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
}

export const useAuth = () => useContext(AuthUserContext);
