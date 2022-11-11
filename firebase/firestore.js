import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
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

const hardCodedArrayOfYears = [
  2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
];
const createdMonthsArray = [];

const createdYearsArray = [];

const userMonthsSetup = () => {
  for (let month of hardCodedArrayOfMonths) {
    const createdMonth = {
      income: 0,
      categories: [],
      month,
      monthBalance: 0,
      totalMonthlyExpenses: 0,
    };
    createdMonthsArray.push(createdMonth);
  }
};

userMonthsSetup();

const userYearsSetup = () => {
  for (let year of hardCodedArrayOfYears) {
    const createdYear = {
      year,
      currentBalance: 0,
      months: createdMonthsArray,
    };
    createdYearsArray.push(createdYear);
  }
};
userYearsSetup();

export const addANewUserExpenseDoc = async (uid, displayName) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length > 0) {
    console.log("user doc exists");
    return;
  } else {
    console.log("creating user doc");
    addDoc(collection(db, "userExpenses"), {
      uid,
      displayName,
      years: createdYearsArray,
    });
  }
};

// export const getUserExpenses = async (uid) => {
//   const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
//   const querySnapshot = await getDocs(q);

//   return querySnapshot.docs[0].data();
// };

/**
 * @param {string} uid
 * @param {number} year
 * @param {string} month
 * @param {number} income
 */
export const addMonthIncome = async (uid, year, month, income) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0].data();

  const yearIndex = userDoc.years.findIndex((y) => y.year === year);
  const monthIndex = userDoc.years[yearIndex].months.findIndex(
    (m) => m.month === month
  );

  // console.log("USER INFO", userDoc);
  // console.log("YEAR INDEX", yearIndex);
  // console.log("MONTH INDEX", monthIndex);

  const updatedUserDoc = {
    ...userDoc,
    years: [
      ...userDoc.years.slice(0, yearIndex),
      {
        ...userDoc.years[yearIndex],
        months: [
          ...userDoc.years[yearIndex].months.slice(0, monthIndex),
          {
            ...userDoc.years[yearIndex].months[monthIndex],
            income,
          },
          ...userDoc.years[yearIndex].months.slice(monthIndex + 1),
        ],
      },
      ...userDoc.years.slice(yearIndex + 1),
    ],
  };

  console.log("UPDATED USER DOC", updatedUserDoc);
  await setDoc(
    doc(db, "userExpenses", querySnapshot.docs[0].id),
    updatedUserDoc
  );
};

/**
 * @param {string} uid
 * @param {number} year
 * @param {string} month
 * @param {object} category
 */
export const addCategory = async (uid, year, month, category) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0].data();

  const yearIndex = userDoc.years.findIndex((y) => y.year === year);
  const monthIndex = userDoc.years[yearIndex].months.findIndex(
    (m) => m.month === month
  );

  const updatedUserDoc = {
    ...userDoc,
    years: [
      ...userDoc.years.slice(0, yearIndex),
      {
        ...userDoc.years[yearIndex],
        months: [
          ...userDoc.years[yearIndex].months.slice(0, monthIndex),
          {
            ...userDoc.years[yearIndex].months[monthIndex],
            categories: [
              ...userDoc.years[yearIndex].months[monthIndex].categories,
              category,
            ],
          },
          ...userDoc.years[yearIndex].months.slice(monthIndex + 1),
        ],
      },
      ...userDoc.years.slice(yearIndex + 1),
    ],
  };

  // console.log("UPDATED CATEGORY", updatedUserDoc);
  await setDoc(
    doc(db, "userExpenses", querySnapshot.docs[0].id),
    updatedUserDoc
  );
};

export const deleteCategory = async (uid, year, month, category) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0].data();

  const yearIndex = userDoc.years.findIndex((y) => y.year === year);
  const monthIndex = userDoc.years[yearIndex].months.findIndex(
    (m) => m.month === month
  );

  const categoryIndex = userDoc.years[yearIndex].months[
    monthIndex
  ].categories.findIndex((c) => c.title === category.title);

  const updatedUserDoc = {
    ...userDoc,
    years: [
      ...userDoc.years.slice(0, yearIndex),
      {
        ...userDoc.years[yearIndex],
        months: [
          ...userDoc.years[yearIndex].months.slice(0, monthIndex),
          {
            ...userDoc.years[yearIndex].months[monthIndex],
            categories: [
              ...userDoc.years[yearIndex].months[monthIndex].categories.slice(
                0,
                categoryIndex
              ),
              ...userDoc.years[yearIndex].months[monthIndex].categories.slice(
                categoryIndex + 1
              ),
            ],
          },
          ...userDoc.years[yearIndex].months.slice(monthIndex + 1),
        ],
      },
      ...userDoc.years.slice(yearIndex + 1),
    ],
  };

  // console.log("Delete CATEGORY", updatedUserDoc);
  await setDoc(
    doc(db, "userExpenses", querySnapshot.docs[0].id),
    updatedUserDoc
  );
};

export const addExpense = async (uid, year, month, category, expense) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0].data();

  const yearIndex = userDoc.years.findIndex((y) => y.year === year);
  const monthIndex = userDoc.years[yearIndex].months.findIndex(
    (m) => m.month === month
  );

  const categoryIndex = userDoc.years[yearIndex].months[
    monthIndex
  ].categories.findIndex((c) => c.title === category);

  const currentExpenses =
    userDoc.years[yearIndex].months[monthIndex].categories[categoryIndex]
      .expenses;

  const currentExpenseTotal = currentExpenses.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  const updatedTotalCategoryExpense = currentExpenseTotal + expense.amount;

  console.log("Add Total Category Expenses", updatedTotalCategoryExpense);

  const updatedUserDoc = {
    ...userDoc,
    years: [
      ...userDoc.years.slice(0, yearIndex),
      {
        ...userDoc.years[yearIndex],
        months: [
          ...userDoc.years[yearIndex].months.slice(0, monthIndex),
          {
            ...userDoc.years[yearIndex].months[monthIndex],
            categories: [
              ...userDoc.years[yearIndex].months[monthIndex].categories.slice(
                0,
                categoryIndex
              ),
              {
                ...userDoc.years[yearIndex].months[monthIndex].categories[
                  categoryIndex
                ],
                expenses: [
                  ...userDoc.years[yearIndex].months[monthIndex].categories[
                    categoryIndex
                  ].expenses,
                  expense,
                ],
                totalCategoryExpenses: updatedTotalCategoryExpense,
              },
              ...userDoc.years[yearIndex].months[monthIndex].categories.slice(
                categoryIndex + 1
              ),
            ],
          },
          ...userDoc.years[yearIndex].months.slice(monthIndex + 1),
        ],
      },
      ...userDoc.years.slice(yearIndex + 1),
    ],
  };

  // console.log("Add Expense", updatedUserDoc);
  await setDoc(
    doc(db, "userExpenses", querySnapshot.docs[0].id),
    updatedUserDoc
  );
};

export const deleteExpense = async (
  uid,
  year,
  month,
  selectedCategory,
  expenseId
) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0].data();

  const yearIndex = userDoc.years.findIndex((y) => y.year === year);
  const monthIndex = userDoc.years[yearIndex].months.findIndex(
    (m) => m.month === month
  );

  const categoryIndex = userDoc.years[yearIndex].months[
    monthIndex
  ].categories.findIndex((c) => c.title === selectedCategory);

  const expenseIndex = userDoc.years[yearIndex].months[monthIndex].categories[
    categoryIndex
  ].expenses.findIndex((e) => e.id === expenseId);

  const deletedExpenseAmount = userDoc.years[yearIndex].months[
    monthIndex
  ].categories[categoryIndex].expenses.find((e) => e.id === expenseId);

  const currentExpenses =
    userDoc.years[yearIndex].months[monthIndex].categories[categoryIndex]
      .expenses;

  const currentExpenseTotal = currentExpenses.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  const updatedTotalCategoryExpense =
    currentExpenseTotal - deletedExpenseAmount.amount;

  // console.log("EXPENSE INDEX", updatedTotalCategoryExpense);

  const updatedUserDoc = {
    ...userDoc,
    years: [
      ...userDoc.years.slice(0, yearIndex),
      {
        ...userDoc.years[yearIndex],
        months: [
          ...userDoc.years[yearIndex].months.slice(0, monthIndex),
          {
            ...userDoc.years[yearIndex].months[monthIndex],
            categories: [
              ...userDoc.years[yearIndex].months[monthIndex].categories.slice(
                0,
                categoryIndex
              ),
              {
                ...userDoc.years[yearIndex].months[monthIndex].categories[
                  categoryIndex
                ],
                expenses: [
                  ...userDoc.years[yearIndex].months[monthIndex].categories[
                    categoryIndex
                  ].expenses.slice(0, expenseIndex),
                  ...userDoc.years[yearIndex].months[monthIndex].categories[
                    categoryIndex
                  ].expenses.slice(expenseIndex + 1),
                ],
                totalCategoryExpenses: updatedTotalCategoryExpense,
              },
              ...userDoc.years[yearIndex].months[monthIndex].categories.slice(
                categoryIndex + 1
              ),
            ],
          },
          ...userDoc.years[yearIndex].months.slice(monthIndex + 1),
        ],
      },
      ...userDoc.years.slice(yearIndex + 1),
    ],
  };

  // console.log("Delete Expense", updatedUserDoc);
  await setDoc(
    doc(db, "userExpenses", querySnapshot.docs[0].id),
    updatedUserDoc
  );
};

export const addMonthBalanceAndExpense = async (
  uid,
  year,
  month,
  monthBalance,
  totalMonthlyExpenses
) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0].data();

  const yearIndex = userDoc.years.findIndex((y) => y.year === year);
  const monthIndex = userDoc.years[yearIndex].months.findIndex(
    (m) => m.month === month
  );

  const updatedUserDoc = {
    ...userDoc,
    years: [
      ...userDoc.years.slice(0, yearIndex),
      {
        ...userDoc.years[yearIndex],
        months: [
          ...userDoc.years[yearIndex].months.slice(0, monthIndex),
          {
            ...userDoc.years[yearIndex].months[monthIndex],
            monthBalance: monthBalance,
            totalMonthlyExpenses: totalMonthlyExpenses,
          },
          ...userDoc.years[yearIndex].months.slice(monthIndex + 1),
        ],
      },
      ...userDoc.years.slice(yearIndex + 1),
    ],
  };

  // console.log("Add Monthly Balance", updatedUserDoc);
  await setDoc(
    doc(db, "userExpenses", querySnapshot.docs[0].id),
    updatedUserDoc
  );
};

export const addYearBalance = async (uid, year, yearBalance) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const userDoc = querySnapshot.docs[0].data();

  const yearIndex = userDoc.years.findIndex((y) => y.year === year);

  const updatedUserDoc = {
    ...userDoc,
    years: [
      ...userDoc.years.slice(0, yearIndex),
      {
        ...userDoc.years[yearIndex],
        currentBalance: yearBalance,
      },
      ...userDoc.years.slice(yearIndex + 1),
    ],
  };

  console.log("Add Year Balance", updatedUserDoc);
  await setDoc(
    doc(db, "userExpenses", querySnapshot.docs[0].id),
    updatedUserDoc
  );
};
