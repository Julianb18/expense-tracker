import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Dialog } from "@headlessui/react";

import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

const REDIRECT_PAGE = "/dashboard";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: REDIRECT_PAGE,
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
};
const Home = () => {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const [login, setLogin] = useState(false);

  // Redirect if finished loading and there's an existing user (user is logged in)
  useEffect(() => {
    if (!isLoading && authUser) {
      router.push(REDIRECT_PAGE);
    }
  }, [authUser, isLoading]);

  return isLoading || (!isLoading && !!authUser) ? (
    <LoadingSpinner />
  ) : (
    <div className="">
      <div>
        <h1>Expense/Budget Tracker App</h1>
        <h3>Keeping it basic!</h3>
        <button onClick={() => setLogin(true)}>Login / Register</button>
      </div>
      <Dialog open={login} onClose={() => setLogin(false)}>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={auth}
        ></StyledFirebaseAuth>
      </Dialog>
    </div>
  );
};

export default Home;
