import { createContext, useEffect, useState } from "react";

import { showCurrentYear } from "../helperFunctions/showCurrentYear";
import { getUserExpenses } from "../firebase/firestore";
import { addANewUserExpenseDoc } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { onSnapshot } from "firebase/firestore";
import { colRef } from "../firebase/firebase";

const UserDataContext = createContext();

const getCurrentMonth = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[new Date().getMonth()];
};

const UserDataProvider = ({ children }) => {
  const { authUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [selectedYear, setSelectedYear] = useState(
    userData && userData.years && userData.years[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const changeEvent = (e) => {
    setSelectedYear(e);
  };

  useEffect(() => {
    if (authUser) {
      onSnapshot(colRef, (snapshot) => {
        const querySnapShot = snapshot.docs.find(
          (doc) => doc.data().uid === authUser?.uid
        );

        const data = querySnapShot?.data();
        console.log("data", data);
        setUserData(data);
        setSelectedYear(showCurrentYear(data));
      });
    }
  }, [authUser]);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        selectedYear,
        selectedMonth,
        setSelectedMonth,
        changeEvent,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataProvider };
