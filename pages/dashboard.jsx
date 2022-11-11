import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { LoadingSpinner } from "../components/LoadingSpinner";
import { Dropdown } from "../components/Dropdown";
import { MonthCard } from "../components/MonthCard";

import { UserDataContext } from "../context/UserDataContext";
import { useAuth } from "../context/AuthContext";

import { addYearBalance } from "../firebase/firestore";

const Dashboard = () => {
  const { userData, selectedYear, changeEvent } = useContext(UserDataContext);
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

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

  console.log(accBalance);
  return authUser && userData && userData.years && selectedYear ? (
    <div className="pt-4">
      <div className="text-white mb-4">
        <h2 className="text-center text-3xl">{selectedYear?.year} - Budget</h2>
      </div>
      <div className="h-full">
        <div className="flex flex-col">
          <div className="flex justify-between mb-4 xl:mb-10 px-4">
            <Dropdown
              years={userData.years}
              changeEvent={changeEvent}
              selectedYear={selectedYear}
            />
            <div className="flex flex-col">
              <span className="ml-3 text-white">Balance</span>
              <div className="flex justify-center min-w-[100px] bg-white rounded-3xl py-2 shadow-gray-800 shadow-lg">
                {selectedYear.currentBalance}
              </div>
            </div>
          </div>
          <div
            className="relative flex px-4 md:px-0 pb-11 h-[calc(100vh-212px)] overflow-hidden 
            scroll-smooth overflow-y-scroll flex-col md:overflow-visible md:h-full 
            md:gap-6 md:space-y-0 items-center md:flex-wrap md:justify-center md:flex-row"
          >
            <div className="sticky xl:hidden top-0 left-0 right-0 w-screen bg-gradient-to-b from-primaryDark to-transparent">
              <div className="h-[40px]"></div>
            </div>
            <div className="fixed xl:hidden bottom-0 left-0 w-full h-[40px] bg-gradient-to-t from-primaryDark to-transparent"></div>

            {selectedYear.months.map((month) => {
              return (
                <Link
                  className="w-full sm:w-fit flex justify-center"
                  href={`/month/${month.month}`}
                  key={month.month}
                >
                  <MonthCard
                    month={month.month}
                    income={month.income}
                    totalMonthlyExpenses={month.totalMonthlyExpenses}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-[40vh] flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
};

export default Dashboard;
