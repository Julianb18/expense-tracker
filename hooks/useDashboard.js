import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { UserDataContext } from "../context/UserDataContext";
import { useAuth } from "../context/AuthContext";
import { addYearBalance } from "../firebase/firestore";

export function useDashboard() {
  const {
    userData,
    selectedYear,
    changeEvent,
    selectedMonth,
    setSelectedMonth,
    defaultCategories,
    handleSaveDefaultCategories,
  } = useContext(UserDataContext);
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

  const [isDefaultCategoriesModalOpen, setIsDefaultCategoriesModalOpen] =
    useState(false);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
  }, [authUser, isLoading, router]);

  const accumulatedBalance = useMemo(() => {
    const months = selectedYear?.months ?? [];
    return months.reduce((total, m) => total + m.monthBalance, 0);
  }, [selectedYear?.months]);

  useEffect(() => {
    if (authUser && selectedYear) {
      addYearBalance(authUser.uid, selectedYear.year, accumulatedBalance);
    }
  }, [accumulatedBalance, authUser, selectedYear]);

  const selectedMonthData = useMemo(() => {
    return selectedYear?.months?.find((m) => m.month === selectedMonth);
  }, [selectedYear, selectedMonth]);

  const openDefaultCategoriesModal = useCallback(() => {
    setIsDefaultCategoriesModalOpen(true);
  }, []);

  const isReady =
    Boolean(authUser && userData && userData.years && selectedYear);

  return {
    userData,
    selectedYear,
    changeEvent,
    selectedMonth,
    setSelectedMonth,
    defaultCategories,
    handleSaveDefaultCategories,
    authUser,
    isLoading,
    isDefaultCategoriesModalOpen,
    setIsDefaultCategoriesModalOpen,
    selectedMonthData,
    openDefaultCategoriesModal,
    isReady,
  };
}
