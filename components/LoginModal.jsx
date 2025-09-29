import { useState, forwardRef, useImperativeHandle } from "react";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Dialog } from "@headlessui/react";

import { XMarkSvg } from "./svg/XMarkSvg";
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

export const LoginModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="absolute z-30 min-w-[300px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl p-3"
    >
      <div className="flex justify-between items-center mb-8">
        <Dialog.Title className="text-lg text-center flex-1">
          Sign In / Register
        </Dialog.Title>
        <button
          className="cursor-pointer p-1"
          onClick={handleClose}
        >
          <XMarkSvg />
        </button>
      </div>
      <div>
        <div className="mb-6">
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={auth}
          />
        </div>
        <Dialog.Description className="text-xs text-gray-500">
          You can Sign Up / Login from here. Even if you do not have an
          account yet, click Sign and the Sign Up process will be started
        </Dialog.Description>
      </div>
    </Dialog>
  );
});
