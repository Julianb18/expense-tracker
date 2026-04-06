import { useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LoginModal } from "../components/LoginModal";

import { useAuth } from "../context/AuthContext";

const REDIRECT_PAGE = "/dashboard";

const Home = () => {
  const { authUser, isLoading, signInAsGuest, guestSignInError } = useAuth();
  const router = useRouter();
  const loginModalRef = useRef();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.replace(REDIRECT_PAGE);
    }
  }, [authUser, isLoading, router]);

  if (isLoading || authUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primaryDark via-secondaryDark to-primaryDark px-4">
        <LoadingSpinner />
        {authUser ? (
          <p className="mt-4 text-center text-sm text-slate-400">
            Taking you to your dashboard…
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-primaryDark via-secondaryDark to-primaryDark">
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6">
        <div className="w-full max-w-3xl text-center">
          <div className="mb-6">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-slate-300 backdrop-blur-sm">
              Personal Budget Tracking
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Track your budget
            <span className="block bg-gradient-to-r from-buttonSecondary to-buttonPrimary bg-clip-text text-transparent">
              without the clutter
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            A simple way to manage income, expenses, and categories in one clean
            dashboard.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              filled
              customClassName="px-8 py-3 text-base"
              onClick={() => loginModalRef.current?.open()}
            >
              Open App
            </Button>
            <Button
              customClassName="border border-white/20 bg-white/5 px-8 py-3 text-base text-white hover:bg-white/10"
              onClick={() => signInAsGuest()}
            >
              Try guest demo
            </Button>
          </div>
          {guestSignInError ? (
            <p className="mx-auto mt-4 max-w-lg rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm leading-snug text-amber-100">
              {guestSignInError}
            </p>
          ) : (
            <p className="mx-auto mt-4 max-w-md text-center text-xs text-slate-500">
              Guest demo skips email and Google—Firebase creates a temporary
              account for your browser session.
            </p>
          )}
        </div>
      </div>

      <LoginModal ref={loginModalRef} />
    </div>
  );
};

export default Home;
