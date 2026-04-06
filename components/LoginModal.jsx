import { useState, forwardRef, useImperativeHandle } from "react";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { AppDialog } from "./AppDialog";
import { Button } from "./Button";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

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
  const { signInAsGuest, guestSignInError, clearGuestSignInError } =
    useAuth();

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const handleClose = () => {
    clearGuestSignInError();
    setIsOpen(false);
  };

  const handleGuest = async () => {
    const ok = await signInAsGuest();
    if (ok) setIsOpen(false);
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

        <div className="relative flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-500">or</span>
          <span className="h-px flex-1 bg-slate-700" />
        </div>

        <Button
          type="button"
          onClick={handleGuest}
          customClassName="w-full border border-slate-600 bg-slate-900/50 text-slate-200 hover:bg-slate-800"
        >
          Try without email (guest demo)
        </Button>

        {guestSignInError ? (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-100">
            {guestSignInError}
          </p>
        ) : null}

        <p className="text-xs leading-5 text-slate-400">
          Guest mode uses an anonymous session—your data is real in the demo,
          but tied only to this browser until you clear it or sign out.
        </p>
      </div>
    </AppDialog>
  );
});

LoginModal.displayName = "LoginModal";
