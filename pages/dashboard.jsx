import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { LoadingSpinner } from "../components/LoadingSpinner";
import { Dropdown } from "../components/Dropdown";
import { MonthCard } from "../components/MonthCard";
import { MonthDropdown } from "../components/MonthDropdown";
import { DefaultCategoriesModal } from "../components/DefaultCategoriesModal";
import { Button } from "../components/Button";

import { UserDataContext } from "../context/UserDataContext";
import { useAuth } from "../context/AuthContext";

import { addYearBalance } from "../firebase/firestore";

const Dashboard = () => {
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

  console.log(selectedYear);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
  }, [authUser, isLoading, router]);

  const accBalance = selectedYear?.months.reduce((acc, curr) => {
    return acc + curr.monthBalance;
  }, 0);

  useEffect(() => {
    if (authUser && selectedYear) {
      addYearBalance(authUser?.uid, selectedYear?.year, accBalance);
    }
  }, [accBalance,authUser, authUser?.uid, selectedYear?.year, selectedYear]);

  return authUser && userData && userData.years && selectedYear ? (
    <div className="h-full max-w-[900px] mx-auto flex flex-col">
      <div className="py-4 flex-shrink-0">
        <div className="text-white mb-4">
          <h2 className="text-center text-3xl">
            {selectedYear?.year} - Budget
          </h2>
        </div>
        <div className="flex justify-between xl:mb-10 px-4">
          <Dropdown
            years={userData.years}
            changeEvent={changeEvent}
            selectedYear={selectedYear}
          />
          <MonthDropdown
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 justify-center mt-6 px-4 pb-20">
        {(() => {
          // Find the selected month data
          const selectedMonthData = selectedYear.months.find(
            (month) => month.month === selectedMonth
          );
          console.log("selectedMonthData", selectedMonthData);

          if (!selectedMonthData) {
            return (
              <div className="text-white text-center">
                No data available for {selectedMonth}
              </div>
            );
          }

          return (
            <Link
              className="w-full sm:w-fit flex justify-center"
              href={`/month/${selectedMonthData.month}`}
              key={selectedMonth}
            >
              <MonthCard
                month={selectedMonthData.month}
                income={selectedMonthData.income}
                totalMonthlyExpenses={selectedMonthData.totalMonthlyExpenses}
                customCss=""
                categories={selectedMonthData.categories || []}
              />
            </Link>
          );
        })()}
      </div>

      {/* Default Categories Button - Fixed at bottom right */}
      <div className="fixed bottom-8 right-8 z-10">
        <Button
          onClick={() => setIsDefaultCategoriesModalOpen(true)}
          customClassName="bg-buttonPrimary text-white px-6 py-3 shadow-lg"
        >
          Default Categories
        </Button>
      </div>

      {/* Default Categories Modal */}
      <DefaultCategoriesModal
        isOpen={isDefaultCategoriesModalOpen}
        setIsOpen={setIsDefaultCategoriesModalOpen}
        existingDefaults={defaultCategories}
        onSave={handleSaveDefaultCategories}
      />
    </div>
  ) : (
    <div className="h-[40vh] flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
};

export default Dashboard;
