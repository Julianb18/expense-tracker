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

const getYearRange = (startYear) => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let y = startYear; y <= currentYear; y++) {
    years.push(y);
  }

  return years;
};

const initializeMonths = () =>
  hardCodedArrayOfMonths.map((month) => ({
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

export const ensureUserYearsUpToDate = async (uid) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return null;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const currentYear = new Date().getFullYear();

  const existingYearsArray = updatedUserDoc.years || [];
  const derivedStartYear =
    updatedUserDoc.startYear ||
    (existingYearsArray.length > 0
      ? Math.min(...existingYearsArray.map((y) => y.year))
      : currentYear);

  updatedUserDoc.startYear = derivedStartYear;

  if (!updatedUserDoc.years) {
    updatedUserDoc.years = [];
  }

  const existingYears = new Set(updatedUserDoc.years.map((y) => y.year));

  for (let year = derivedStartYear; year <= currentYear; year++) {
    if (!existingYears.has(year)) {
      updatedUserDoc.years.push(createYearObject(year));
    }
  }

  updatedUserDoc.years.sort((a, b) => a.year - b.year);

  await updateUserDoc(userDoc.id, updatedUserDoc);
  return updatedUserDoc;
};

export const addANewUserExpenseDoc = async (uid, displayName) => {
  const userDoc = await getUserDocRef(uid);

  if (userDoc) {
    console.log("User doc exists");
    await ensureUserYearsUpToDate(uid);
    return;
  }

  const startYear = new Date().getFullYear();

  await addDoc(collection(db, "userExpenses"), {
    uid,
    displayName,
    startYear,
    years: initializeYears(startYear),
    defaultCategories: [],
  });
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
    (c) => c.title !== selectedCategory,
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

  const expenseWithMeta = {
    ...expense,
    createdAt: Date.now(),
  };

  categoryData.expenses.push(expenseWithMeta);
  categoryData.totalCategoryExpenses += expense.amount;

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const deleteExpense = async (
  uid,
  year,
  month,
  selectedCategory,
  expenseId,
) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  const categoryData = monthData.categories.find(
    (c) => c.title === selectedCategory,
  );

  const expenseIndex = categoryData.expenses.findIndex(
    (e) => e.id === expenseId,
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
  totalMonthlyExpenses,
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
  newTitle,
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
  newMaxSpending,
) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  const categoryData = monthData.categories.find(
    (c) => c.title === categoryTitle,
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
  currentMonth,
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

  const currentYearData = updatedUserDoc.years.find(
    (y) => y.year === currentYear,
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

export const updateCategoryOrder = async (uid, year, month, newCategories) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return false;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };
  const yearData = updatedUserDoc.years.find((y) => y.year === year);

  if (yearData) {
    const monthData = yearData.months.find((m) => m.month === month);

    if (monthData) {
      monthData.categories = newCategories;
      await updateUserDoc(userDoc.id, updatedUserDoc);
      return true;
    }
  }

  return false;
};
