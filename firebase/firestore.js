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
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const hardCodedArrayOfYears = [
  2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030
];

const initializeMonths = () => hardCodedArrayOfMonths.map(month => ({
  income: 0,
  categories: [],
  month,
  monthBalance: 0,
  totalMonthlyExpenses: 0,
}));

const initializeYears = () => hardCodedArrayOfYears.map(year => ({
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

export const deleteExpense = async (uid, year, month, selectedCategory, expenseId) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  const categoryData = monthData.categories.find((c) => c.title === selectedCategory);

  const expenseIndex = categoryData.expenses.findIndex((e) => e.id === expenseId);
  const deletedExpense = categoryData.expenses.splice(expenseIndex, 1)[0];
  categoryData.totalCategoryExpenses -= deletedExpense.amount;

  await updateUserDoc(userDoc.id, updatedUserDoc);
};

export const addMonthBalanceAndExpense = async (uid, year, month, monthBalance, totalMonthlyExpenses) => {
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

export const updateCategoryTitle = async (uid, year, month, oldTitle, newTitle) => {
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

export const updateCategoryMaxSpending = async (uid, year, month, categoryTitle, newMaxSpending) => {
  const userDoc = await getUserDocRef(uid);
  if (!userDoc) return;

  const userData = userDoc.data();
  const updatedUserDoc = { ...userData };

  const yearData = updatedUserDoc.years.find((y) => y.year === year);
  const monthData = yearData.months.find((m) => m.month === month);
  const categoryData = monthData.categories.find((c) => c.title === categoryTitle);
  
  if (categoryData) {
    categoryData.maxSpending = newMaxSpending;
    await updateUserDoc(userDoc.id, updatedUserDoc);
  }
};