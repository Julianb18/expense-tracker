import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { addANewUserExpenseDoc, getUserExpenses } from "../firebase/firestore";
import { Dropdown } from "../components/Dropdown";
import { MonthCard } from "../components/MonthCard";
import { showCurrentYear } from "../helperFunctions/showCurrentYear";
import Link from "next/link";
import { UserDataContext } from "../context/UserDataContext";

const Dashboard = () => {
  const { userData, selectedYear, changeEvent } = useContext(UserDataContext);
  const { authUser, isLoading } = useAuth();
  const router = useRouter();

  // const [userData, setUserData] = useState({});

  // const [selectedYear, setSelectedYear] = useState(
  //   userData && userData.years && userData.years[0]
  // );

  // console.log("current year", showCurrentYear());

  // const changeEvent = (e) => {
  //   setSelectedYear(e);
  // };

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
    // if (authUser && authUser.uid && authUser.displayName) {
    //   addANewUserExpenseDoc(authUser.uid, authUser.displayName);
    // }
  }, [authUser, isLoading]);

  // useEffect(() => {
  //   if (authUser) {
  //     const fetchData = async () => {
  //       const data = await getUserExpenses(authUser.uid);
  //       return data;
  //     };
  //     fetchData()
  //       .then((data) => {
  //         setUserData(data);
  //         setSelectedYear(showCurrentYear(data));
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [authUser]);

  // console.log("NEW SELECTEDYear", selectedYear.months);
  // console.log("USERDATA", userData);

  return !authUser ? (
    <LoadingSpinner />
  ) : (
    <div className="min-h-screen bg-gray-200 p-3">
      <h2>DashBoard</h2>
      <div>
        {userData && userData.years ? (
          <div>
            <div className="flex justify-between mb-9">
              <Dropdown
                years={userData.years}
                changeEvent={changeEvent}
                selectedYear={selectedYear}
              />
              <div className="flex flex-col items-center">
                <span>Balance</span>
                <div className="flex justify-center min-w-[100px] sm:text-sm bg-white rounded-3xl py-2">
                  {selectedYear.currentBalance}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center md:flex-wrap md:justify-center md:flex-row">
              {selectedYear.months.map((month) => {
                return (
                  <Link
                    className="w-full sm:w-fit flex justify-center"
                    href={`/month/${month.month}`}
                    key={month.month}
                  >
                    <MonthCard month={month.month} income={month.income} />
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div>Please refresh the page</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
