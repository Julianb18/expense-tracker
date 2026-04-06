import { useState, forwardRef, useImperativeHandle } from "react";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { AppDialog } from "./AppDialog";
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
    <AppDialog
      open={isOpen}
      onClose={handleClose}
      title="Sign In / Register"
      maxWidthClassName="max-w-[420px]"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>

        <p className="text-xs leading-5 text-slate-400">
          You can sign up or log in from here. Even if you do not have an
          account yet, start the sign-in flow and the sign-up process will
          begin.
        </p>
      </div>
    </AppDialog>
  );
});

LoginModal.displayName = "LoginModal";
