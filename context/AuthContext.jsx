import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { useRouter } from "next/router";

import { addANewUserExpenseDoc } from "../firebase/firestore";
import { auth } from "../firebase/firebase";

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
      addANewUserExpenseDoc(user.uid, user.displayName);

      setAuthUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });

      setIsLoading(false);
    }
  };

  const signOut = () => authSignOut(auth).then(clear && router.push("/"));

  // Listen for Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    isLoading,
    signOut,
  };
}

const AuthUserContext = createContext({
  authUser: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
}

export const useAuth = () => useContext(AuthUserContext);
