import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

const Dashboard = () => {
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);

  return !authUser ? (
    <LoadingSpinner />
  ) : (
    <div className="min-h-screen bg-gray-200">Dashboard</div>
  );
};

export default Dashboard;
