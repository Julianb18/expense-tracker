import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Dialog } from "@headlessui/react";

import { Button } from "../components/Button";
import { XMarkSvg } from "../components/svg/XMarkSvg";
import { LoadingSpinner } from "../components/LoadingSpinner";

import { useAuth } from "../context/AuthContext";

import { auth } from "../firebase/firebase";

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

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push(REDIRECT_PAGE);
    }
  }, [authUser, isLoading]);

  return isLoading || (!isLoading && !!authUser) ? (
    <LoadingSpinner />
  ) : (
    <div className="p-4">
      <div className="text-center text-white mb-8">
        <h1 className="text-3xl ">LANDING PAGE COMING SOON</h1>
        <h3 className="text-lg ">Keeping it basic!</h3>
      </div>
      <div className="flex justify-center">
        <Button filled onClick={() => setLogin(true)}>
          Login / Register
        </Button>
      </div>
      <Dialog
        open={login}
        onClose={() => setLogin(false)}
        className="absolute z-30 min-w-[300px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl p-3"
      >
        <div className="flex justify-between items-center mb-8">
          <Dialog.Title className="text-lg text-center flex-1">
            Sign In / Register
          </Dialog.Title>
          <button
            className="cursor-pointer p-1"
            onClick={() => setLogin(false)}
          >
            <XMarkSvg />
          </button>
        </div>
        <div>
          <div className="mb-6">
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={auth}
            ></StyledFirebaseAuth>
          </div>
          <Dialog.Description className="text-xs text-gray-500">
            You can Sign Up / Login from here. Even if you do not have an
            account yet, click Sign and the Sign Up process will be started
          </Dialog.Description>
        </div>
      </Dialog>
    </div>
  );
};

export default Home;
