import { useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LoginModal } from "../components/LoginModal";

import { useAuth } from "../context/AuthContext";

const REDIRECT_PAGE = "/dashboard";

const Home = () => {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const loginModalRef = useRef();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push(REDIRECT_PAGE);
    }
  }, [authUser, isLoading, router]);

  if (isLoading || (!isLoading && authUser)) {
    return <LoadingSpinner />;
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

          <div className="flex justify-center">
            <Button
              filled
              customClassName="px-8 py-3 text-base"
              onClick={() => loginModalRef.current?.open()}
            >
              Open App
            </Button>
          </div>
        </div>
      </div>

      <LoginModal ref={loginModalRef} />
    </div>
  );
};

export default Home;
