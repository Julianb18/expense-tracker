import {
  addDoc,
  collection,
  doc,
  query,
  setDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

import { MONTHS } from "../utils/constants";

const getCurrentYear = () => new Date().getFullYear();

const getYearRange = (startYear) => {
  const currentYear = getCurrentYear();
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
};

const initializeMonths = () =>
  MONTHS.map((month) => ({
    income: 0,
    categories: [],
    month,
    monthBalance: 0,
    totalMonthlyExpenses: 0,
  }));

const createYearObject = (year) => ({
  year,
  currentBalance: 0,
  months: initializeMonths(),
});

const initializeYears = (startYear) =>
  getYearRange(startYear).map((year) => createYearObject(year));

const getYearData = (userData, year) =>
  userData?.years?.find((item) => item.year === year);

const getMonthData = (yearData, month) =>
  yearData?.months?.find((item) => item.month === month);

const getCategoryData = (monthData, categoryTitle) =>
  monthData?.categories?.find((item) => item.title === categoryTitle);

const getUserDocRef = async (uid) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0];
  }

  return null;
};

const updateUserDoc = async (docId, updatedUserDoc) => {
  await setDoc(doc(db, "userExpenses", docId), updatedUserDoc);
};

const updateUserExpenseDoc = async (uid, updater) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return null;

  const userData = userDoc.data();
  const nextUserData = {
    ...userData,
    years: userData.years ? [...userData.years] : [],
  };

  const didChange = await updater(nextUserData, userDoc);

  if (didChange === false) {
    return null;
  }

  await updateUserDoc(userDoc.id, nextUserData);
  return nextUserData;
};

export const ensureUserYearsUpToDate = async (uid) => {
  return updateUserExpenseDoc(uid, async (nextUserData) => {
    const currentYear = getCurrentYear();

    const existingYears = nextUserData.years || [];
    const derivedStartYear =
      nextUserData.startYear ||
      (existingYears.length > 0
        ? Math.min(...existingYears.map((item) => item.year))
        : currentYear);

    nextUserData.startYear = derivedStartYear;

    if (!nextUserData.years) {
      nextUserData.years = [];
    }

    const existingYearSet = new Set(
      nextUserData.years.map((item) => item.year),
    );

    for (let year = derivedStartYear; year <= currentYear; year++) {
      if (!existingYearSet.has(year)) {
        nextUserData.years.push(createYearObject(year));
      }
    }

    nextUserData.years.sort((a, b) => a.year - b.year);
  });
};

export const addANewUserExpenseDoc = async (uid, displayName) => {
  const userDoc = await getUserDocRef(uid);

  if (userDoc) {
    console.log("User doc exists");
    await ensureUserYearsUpToDate(uid);
    return;
  }

  const startYear = getCurrentYear();

  await addDoc(collection(db, "userExpenses"), {
    uid,
    displayName,
    startYear,
    years: initializeYears(startYear),
    defaultCategories: [],
  });
};

export const addMonthIncome = async (uid, year, month, income) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    monthData.income = income;
  });
};

export const addCategory = async (uid, year, month, category) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    monthData.categories.push(category);
  });
};

export const deleteCategory = async (uid, year, month, selectedCategory) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    monthData.categories = monthData.categories.filter(
      (category) => category.title !== selectedCategory,
    );
  });
};

export const addExpense = async (uid, year, month, category, expense) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    const categoryData = getCategoryData(monthData, category);
    if (!categoryData) return false;

    const expenseWithMeta = {
      ...expense,
      createdAt: Date.now(),
    };

    categoryData.expenses.push(expenseWithMeta);
    categoryData.totalCategoryExpenses += expense.amount;
  });
};

export const deleteExpense = async (
  uid,
  year,
  month,
  selectedCategory,
  expenseId,
) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    const categoryData = getCategoryData(monthData, selectedCategory);
    if (!categoryData) return false;

    const expenseIndex = categoryData.expenses.findIndex(
      (expense) => expense.id === expenseId,
    );

    if (expenseIndex === -1) return false;

    const deletedExpense = categoryData.expenses.splice(expenseIndex, 1)[0];
    categoryData.totalCategoryExpenses -= deletedExpense.amount;
  });
};

export const addMonthBalanceAndExpense = async (
  uid,
  year,
  month,
  monthBalance,
  totalMonthlyExpenses,
) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    monthData.monthBalance = monthBalance;
    monthData.totalMonthlyExpenses = totalMonthlyExpenses;
  });
};

export const addYearBalance = async (uid, year, yearBalance) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    yearData.currentBalance = yearBalance;
  });
};

export const updateCategoryTitle = async (
  uid,
  year,
  month,
  oldTitle,
  newTitle,
) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    const categoryData = getCategoryData(monthData, oldTitle);
    if (!categoryData) return false;

    categoryData.title = newTitle;
  });
};

export const updateCategoryMaxSpending = async (
  uid,
  year,
  month,
  categoryTitle,
  newMaxSpending,
) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    const categoryData = getCategoryData(monthData, categoryTitle);
    if (!categoryData) return false;

    categoryData.maxSpending = newMaxSpending;
  });
};

export const setDefaultCategories = async (uid, defaultCategories) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    nextUserData.defaultCategories = defaultCategories;
  });
};

export const getDefaultCategories = async (uid) => {
  const userDoc = await getUserDocRef(uid);

  if (!userDoc) {
    console.log("Firestore: No user doc found");
    return [];
  }

  const userData = userDoc.data();
  return userData.defaultCategories || [];
};

export const applyDefaultCategoriesToFutureMonths = async (
  uid,
  currentYear,
  currentMonth,
) => {
  await updateUserExpenseDoc(uid, async (nextUserData) => {
    const defaultCategories = nextUserData.defaultCategories || [];
    if (defaultCategories.length === 0) return false;

    const currentMonthIndex = MONTHS.indexOf(currentMonth);
    const currentYearData = getYearData(nextUserData, currentYear);

    if (currentYearData) {
      for (let i = currentMonthIndex + 1; i < MONTHS.length; i++) {
        const monthData = currentYearData.months[i];
        if (monthData) {
          monthData.categories = [...defaultCategories];
        }
      }
    }

    nextUserData.years.forEach((yearData) => {
      if (yearData.year > currentYear) {
        yearData.months.forEach((monthData) => {
          monthData.categories = [...defaultCategories];
        });
      }
    });
  });
};

export const ensureMonthHasCurrentDefaults = async (uid, year, month) => {
  const result = await updateUserExpenseDoc(uid, async (nextUserData) => {
    const defaultCategories = nextUserData.defaultCategories || [];
    if (defaultCategories.length === 0) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const targetMonthIndex = MONTHS.indexOf(month);

    const isFutureMonth =
      year > currentYear ||
      (year === currentYear && targetMonthIndex > currentMonthIndex);

    if (!isFutureMonth) return false;

    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    monthData.categories = [...defaultCategories];
  });

  return !!result;
};

export const resetMonthToDefaults = async (uid, year, month) => {
  const result = await updateUserExpenseDoc(uid, async (nextUserData) => {
    const defaultCategories = nextUserData.defaultCategories || [];
    if (defaultCategories.length === 0) return false;

    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    monthData.categories = [...defaultCategories];
  });

  return !!result;
};

export const updateCategoryOrder = async (uid, year, month, newCategories) => {
  const result = await updateUserExpenseDoc(uid, async (nextUserData) => {
    const yearData = getYearData(nextUserData, year);
    if (!yearData) return false;

    const monthData = getMonthData(yearData, month);
    if (!monthData) return false;

    monthData.categories = newCategories;
  });

  return !!result;
};
