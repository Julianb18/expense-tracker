import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { LoadingSpinner } from "../components/LoadingSpinner";
import { Dropdown } from "../components/Dropdown";
import { MonthCard } from "../components/MonthCard";
import { MonthDropdown } from "../components/MonthDropdown";

import { UserDataContext } from "../context/UserDataContext";
import { useAuth } from "../context/AuthContext";

import { addYearBalance } from "../firebase/firestore";
import { CircularArrowDown } from "../components/svg/CircularArrowDown";

const Dashboard = () => {
  const {
    userData,
    selectedYear,
    changeEvent,
    selectedMonth,
    setSelectedMonth,
  } = useContext(UserDataContext);
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

  console.log(selectedYear);

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);

  const accBalance = selectedYear?.months.reduce((acc, curr) => {
    return acc + curr.monthBalance;
  }, 0);

  useEffect(() => {
    if (authUser && selectedYear) {
      addYearBalance(authUser?.uid, selectedYear?.year, accBalance);
    }
  }, [accBalance, authUser?.uid, selectedYear?.year]);

  return authUser && userData && userData.years && selectedYear ? (
    <div className="h-full max-w-[900px] mx-auto">
      <div className={`py-4`}>
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

      <div className="flex flex-col items-center mt-20 px-4">
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
              className="w-full sm:w-fit flex justify-center last:mb-20"
              href={`/month/${selectedMonthData.month}`}
              key={selectedMonth}
            >
              <MonthCard
                month={selectedMonthData.month}
                income={selectedMonthData.income}
                totalMonthlyExpenses={selectedMonthData.totalMonthlyExpenses}
                customCss=""
              />
            </Link>
          );
        })()}
      </div>
    </div>
  ) : (
    <div className="h-[40vh] flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
};

export default Dashboard;
