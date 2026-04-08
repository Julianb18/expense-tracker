import React from "react";
import Link from "next/link";

import { LoadingSpinner } from "../components/LoadingSpinner";
import { Dropdown } from "../components/Dropdown";
import { MonthCard } from "../components/MonthCard";
import { MonthDropdown } from "../components/MonthDropdown";
import { DefaultCategoriesModal } from "../components/DefaultCategoriesModal";
import { Button } from "../components/Button";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard = () => {
  const {
    userData,
    selectedYear,
    changeEvent,
    selectedMonth,
    setSelectedMonth,
    defaultCategories,
    handleSaveDefaultCategories,
    isDefaultCategoriesModalOpen,
    setIsDefaultCategoriesModalOpen,
    selectedMonthData,
    openDefaultCategoriesModal,
    isReady,
  } = useDashboard();

  if (!isReady) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4">
        <LoadingSpinner />
        <p className="mt-4 text-center text-sm text-slate-400">
          Loading your budget data…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[900px] mx-auto flex flex-col justify-center">
      <div className="mt-20 py-4 flex-shrink-0">
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

      <div className="flex flex-col items-center flex-1 mt-6 px-4 pb-20">
        {!selectedMonthData ? (
          <div className="text-white text-center">
            No data available for {selectedMonth}
          </div>
        ) : (
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
        )}
      </div>

      <div className="fixed bottom-8 right-8 z-10">
        <Button
          onClick={openDefaultCategoriesModal}
          filled
          customClassName="text-white px-6 py-3 shadow-lg"
        >
          Default Categories
        </Button>
      </div>

      <DefaultCategoriesModal
        isOpen={isDefaultCategoriesModalOpen}
        setIsOpen={setIsDefaultCategoriesModalOpen}
        existingDefaults={defaultCategories}
        onSave={handleSaveDefaultCategories}
      />
    </div>
  );
};

export default Dashboard;
