import { createContext, useEffect, useState } from "react";

import { showCurrentYear } from "../helperFunctions/showCurrentYear";
import {
  getUserExpenses,
  addANewUserExpenseDoc,
  setDefaultCategories,
  getDefaultCategories,
  applyDefaultCategoriesToFutureMonths,
} from "../firebase/firestore";
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
  const [defaultCategories, setDefaultCategoriesState] = useState([]);

  const changeEvent = (e) => {
    setSelectedYear(e);
  };

  // Load default categories when user data changes
  useEffect(() => {
    if (userData && userData.defaultCategories) {
      setDefaultCategoriesState(userData.defaultCategories);
    }
  }, [userData]);

  // Load default categories when component mounts
  useEffect(() => {
    const loadDefaultCategories = async () => {
      if (authUser?.uid) {
        const defaults = await getDefaultCategories(authUser.uid);
        setDefaultCategoriesState(defaults);
      }
    };
    loadDefaultCategories();
  }, [authUser?.uid]);

  const handleSaveDefaultCategories = async (newDefaultCategories) => {
    if (authUser?.uid) {
      await setDefaultCategories(authUser.uid, newDefaultCategories);
      setDefaultCategoriesState(newDefaultCategories);

      // Apply to future months only
      const currentDate = new Date();
      const currentMonthName = getCurrentMonth();
      const currentYear = currentDate.getFullYear();

      await applyDefaultCategoriesToFutureMonths(
        authUser.uid,
        currentYear,
        currentMonthName
      );
    }
  };

  // Listen for real-time updates to user data
  useEffect(() => {
    if (authUser) {
      onSnapshot(colRef, (snapshot) => {
        const querySnapShot = snapshot.docs.find(
          (doc) => doc.data().uid === authUser?.uid
        );

        const data = querySnapShot?.data();
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
        defaultCategories,
        handleSaveDefaultCategories,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataContext, UserDataProvider };
