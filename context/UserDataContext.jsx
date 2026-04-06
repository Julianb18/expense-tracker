import { createContext, useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

import {
  addANewUserExpenseDoc,
  setDefaultCategories,
  applyDefaultCategoriesToFutureMonths,
  ensureUserYearsUpToDate,
} from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { colRef } from "../firebase/firebase";

import { MONTHS } from "../utils/constants";

const UserDataContext = createContext();

const getCurrentMonth = () => {
  return MONTHS[new Date().getMonth()];
};

const showCurrentYear = (data) => {
  if (data && data.years) {
    const currentYear = new Date().getFullYear();
    return data.years.find((year) => year.year === currentYear) || {};
  }
  return {};
};

const UserDataProvider = ({ children }) => {
  const { authUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [defaultCategories, setDefaultCategoriesState] = useState([]);

  const changeEvent = (year) => {
    setSelectedYear(year);
  };

  const handleSaveDefaultCategories = async (newDefaultCategories) => {
    if (!authUser?.uid) return;

    await setDefaultCategories(authUser.uid, newDefaultCategories);
    setDefaultCategoriesState(newDefaultCategories);

    const currentDate = new Date();
    const currentMonthName = getCurrentMonth();
    const currentYear = currentDate.getFullYear();

    await applyDefaultCategoriesToFutureMonths(
      authUser.uid,
      currentYear,
      currentMonthName,
    );
  };

  useEffect(() => {
    const setupUserData = async () => {
      if (!authUser?.uid) {
        setUserData(null);
        setSelectedYear(null);
        setDefaultCategoriesState([]);
        return;
      }

      await addANewUserExpenseDoc(
        authUser.uid,
        authUser.displayName || authUser.email || "User",
        { isAnonymous: authUser.isAnonymous === true },
      );

      await ensureUserYearsUpToDate(authUser.uid);
    };

    setupUserData();
  }, [authUser]);

  useEffect(() => {
    if (!authUser?.uid) return;

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const matchingDoc = snapshot.docs.find(
        (doc) => doc.data().uid === authUser.uid,
      );

      if (!matchingDoc) {
        setUserData(null);
        setSelectedYear(null);
        setDefaultCategoriesState([]);
        return;
      }

      const data = matchingDoc.data();

      setUserData(data);
      setDefaultCategoriesState(data.defaultCategories || []);

      const currentYearData = showCurrentYear(data);
      setSelectedYear((prevSelectedYear) => {
        if (!prevSelectedYear) return currentYearData;

        const stillExists = data.years?.find(
          (year) => year.year === prevSelectedYear.year,
        );

        return stillExists || currentYearData;
      });
    });

    return () => unsubscribe();
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
