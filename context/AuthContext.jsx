// import { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../firebase/firebase";

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthContextProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   console.log(user);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       // console.log(user.)
//       if (user) {
//         setUser({
//           uid: user.uid,
//           email: user.email,
//           displayName: user.displayName,
//         });
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const signUp = (email, password) => {
//     return auth.createUserWithEmailAndPassword(auth, email, password);
//   };

//   const login = (email, password) => {
//     return auth.signInWithEmailAndPassword(auth, email, password);
//   };

//   const logout = async () => {
//     setUser(null);
//     await signOut(auth);
//   };
//   return (
//     <AuthContext.Provider value={{ user, login, signUp, logout }}>
//       {loading ? null : children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    setAuthUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });
    setIsLoading(false);
  };

  const signOut = () => authSignOut(auth).then(clear);

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
