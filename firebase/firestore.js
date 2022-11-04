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

// import { useAuth } from "../context/AuthContext";

// const userExpenses = collection(db, "userExpenses");

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
    };
    createdMonthsArray.push(createdMonth);
  }
};

userMonthsSetup();
// console.log(createdMonthsArray);

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
// console.log(createdYearsArray);

// export const add
// export const userDocExists = async (uid) => {
//   const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
//   const querySnapshot = await getDocs(q);

//   console.log("user doc exists", querySnapshot.docs.length > 0);
//   return querySnapshot.docs.length > 0;
// };

export const addANewUserExpenseDoc = async (uid, displayName) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  console.log("user doc exists", querySnapshot.docs.length > 0);
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

export const getUserExpenses = async (uid) => {
  const q = query(collection(db, "userExpenses"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  // console.log("DATA", querySnapshot.docs[0].data());
  return querySnapshot.docs[0].data();
};

//   const newDoc = await addDoc(userExpenses, {
//     userName: "testUser",
//     currentBalance: 3000,
//     years
//   });

// addANewUserExpenseDoc();
