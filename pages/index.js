import { useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { Button } from "../components/Button";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MoneySvg } from "../components/svg/MoneySvg";
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
  }, [authUser, isLoading]);

  return isLoading || (!isLoading && !!authUser) ? (
    <LoadingSpinner />
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-6">
              <div className="w-12 h-12 text-white">
                <MoneySvg />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Take Control of Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Finances
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Track expenses, set budgets, and achieve your financial goals with
              our intuitive expense tracking app.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              customClassName="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => loginModalRef.current?.open()}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Smart Analytics
            </h3>
            <p className="text-gray-300">
              Get detailed insights into your spending patterns with beautiful
              charts and reports.
            </p>
          </div>

          <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Budget Goals
            </h3>
            <p className="text-gray-300">
              Set monthly budgets for different categories and track your
              progress in real-time.
            </p>
          </div>

          <div className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Secure & Private
            </h3>
            <p className="text-gray-300">
              Your financial data is encrypted and stored securely with
              industry-standard protection.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-400">
          © 2024 ExpenseTracker. Built with ❤️ for better financial management.
        </p>
      </div>

      <LoginModal ref={loginModalRef} />
    </div>
  );
};

export default Home;
