import {
  addDoc,
  collection,
  doc,
  query,
  setDoc,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

const hardCodedArrayOfMonths = [
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

const hardCodedArrayOfYears = [
  2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
];

const initializeMonths = () =>
  hardCodedArrayOfMonths.map((month) => ({
    income: 0,
    categories: [],
    month,
    monthBalance: 0,
    totalMonthlyExpenses: 0,
  }));

const initializeYears = () =>
  hardCodedArrayOfYears.map((year) => ({
    year,
    currentBalance: 0,
    months: initializeMonths(),
  }));

const getUserDocRef = async (uid) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0];
  }
  return null;
};

export const addANewUserExpenseDoc = async (uid, displayName) => {
  const userDoc = await getUserDocRef(uid);

  if (userDoc) {
    console.log("User doc exists");
    return;
  }

  console.log("Creating user doc");
  await addDoc(collection(db, "userExpenses"), {
    uid,
    displayName,
    years: initializeYears(),
    defaultCategories: [], // Initialize with empty default categories
  });
};

const updateUserDoc = async (docId, updatedUserDoc) => {
  await setDoc(doc(db, "userExpenses", docId), updatedUserDoc);
};

export const addMonthIncome = async (uid, year, month, income) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  monthData.income = income;

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const addCategory = async (uid, year, month, category) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  monthData.categories.push(category);

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const deleteCategory = async (uid, year, month, selectedCategory) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  monthData.categories = monthData.categories.filter(
    (c) => c.title !== selectedCategory
  );

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const addExpense = async (uid, year, month, category, expense) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  const categoryData = monthData.categories.find((c) => c.title === category);

  categoryData.expenses.push(expense);
  categoryData.totalCategoryExpenses += expense.amount;

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const deleteExpense = async (
  uid,
  year,
  month,
  selectedCategory,
  expenseId
) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  const categoryData = monthData.categories.find(
    (c) => c.title === selectedCategory
  );

  const expenseIndex = categoryData.expenses.findIndex(
    (e) => e.id === expenseId
  );
  const deletedExpense = categoryData.expenses.splice(expenseIndex, 1)[0];
  categoryData.totalCategoryExpenses -= deletedExpense.amount;

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const addMonthBalanceAndExpense = async (
  uid,
  year,
  month,
  monthBalance,
  totalMonthlyExpenses
) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  monthData.monthBalance = monthBalance;
  monthData.totalMonthlyExpenses = totalMonthlyExpenses;

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const addYearBalance = async (uid, year, yearBalance) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  yearData.currentBalance = yearBalance;

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const updateCategoryTitle = async (
  uid,
  year,
  month,
  oldTitle,
  newTitle
) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  const categoryData = monthData.categories.find((c) => c.title === oldTitle);

  if (categoryData) {
    categoryData.title = newTitle;
    await updateUserDoc(userDoc.id, updatedUserDoc);
  }
};

export const updateCategoryMaxSpending = async (
  uid,
  year,
  month,
  categoryTitle,
  newMaxSpending
) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  const categoryData = monthData.categories.find(
    (c) => c.title === categoryTitle
  );

  if (categoryData) {
    categoryData.maxSpending = newMaxSpending;
    await updateUserDoc(userDoc.id, updatedUserDoc);
  }
};

export const setDefaultCategories = async (uid, defaultCategories) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  updatedUserDoc.defaultCategories = defaultCategories;
  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const getDefaultCategories = async (uid) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) {
    console.log("Firestore: No user doc found");
    return [];
  }

  const userData = userDoc.data();
  const defaults = userData.defaultCategories || [];
  return defaults;
};

export const applyDefaultCategoriesToFutureMonths = async (
  uid,
  currentYear,
  currentMonth
) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };
  const defaultCategories = userData.defaultCategories || [];

  if (defaultCategories.length === 0) {
    return;
  }

  const currentMonthIndex = hardCodedArrayOfMonths.indexOf(currentMonth);
  let updatedMonthsCount = 0;

  // Apply to future months in current year (including months that already have categories)
  const currentYearData = updatedUserDoc.years.find(
    (y) => y.year === currentYear
  );
  if (currentYearData) {
    for (
      let i = currentMonthIndex + 1;
      i < hardCodedArrayOfMonths.length;
      i++
    ) {
      const monthData = currentYearData.months[i];
      monthData.categories = [...defaultCategories];
      updatedMonthsCount++;
    }
  }

  // Apply to all months in future years (overwrite existing categories)
  updatedUserDoc.years.forEach((yearData) => {
    if (yearData.year > currentYear) {
      yearData.months.forEach((monthData) => {
        monthData.categories = [...defaultCategories];
        updatedMonthsCount++;
      });
    }
  });

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const ensureMonthHasCurrentDefaults = async (uid, year, month) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return false;

  const userData = userDoc.data();
  const defaultCategories = userData.defaultCategories || [];

  if (defaultCategories.length === 0) return false;

  // Check if this is a future month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  const targetMonthIndex = hardCodedArrayOfMonths.indexOf(month);

  const isFutureMonth =
    year > currentYear ||
    (year === currentYear && targetMonthIndex > currentMonthIndex);

  if (!isFutureMonth) {
    return false;
  }

  // Check if month already has the current defaults
  const updatedUserDoc = { ...userData };
  const yearData = updatedUserDoc.years.find((y) => y.year === year);

  if (yearData) {
    const monthData = yearData.months.find((m) => m.month === month);

    if (monthData) {
      // Always update future months to ensure they have current defaults
      monthData.categories = [...defaultCategories];
      await updateUserDoc(userDoc.id, updatedUserDoc);
      return true;
    }
  }

  return false;
};

export const resetMonthToDefaults = async (uid, year, month) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return false;

  const userData = userDoc.data();
  const defaultCategories = userData.defaultCategories || [];

  if (defaultCategories.length === 0) return false;

  const updatedUserDoc = { ...userData };
  const yearData = updatedUserDoc.years.find((y) => y.year === year);

  if (yearData) {
    const monthData = yearData.months.find((m) => m.month === month);

    if (monthData) {
      monthData.categories = [...defaultCategories];
      await updateUserDoc(userDoc.id, updatedUserDoc);
      return true;
    }
  }

  return false;
};
