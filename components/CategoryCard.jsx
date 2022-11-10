import React, { useEffect, useState } from "react";
import {
  addTotalCategoryExpense,
  addTotalCategoryExpenses,
  deleteCategory,
} from "../firebase/firestore";
import { expenseColor } from "../helperFunctions/expenseColor";
import { Button } from "./Button";

export const CategoryCard = ({
  category,
  handleAddExpense,
  handleViewExpense,
  uid,
  month,
  year,
}) => {
  const { title, maxSpending, expenses } = category;

  const [spentPercentage, setSpentPercentage] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);

  // const totalExpenses = expenses.reduce((acc, curr) => {
  //   return acc + curr.amount;
  // }, 0);

  useEffect(() => {
    const total = expenses.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

    let percentage = (total / maxSpending) * 100;
    if (percentage > 100) {
      percentage = 100;
    }
    setSpentPercentage(Math.round(percentage));

    setTotalExpenses(total);
  }, [expenses, maxSpending]);
  // useEffect(() => {
  //   // setTotalMonthlyExpenses((prev) => prev + totalExpenses);
  //   // expenses.forEach((expense) => {
  //   //   addTotalCategoryExpense(uid, year, month, title, expense);})
  //   console.log("add expense!!!");
  //   addTotalCategoryExpenses(uid, year, month, title, totalExpenses);
  // }, [uid, year, month, title, totalExpenses]);
  // useEffect(() => {
  //   addTotalCategoryExpense(uid, year, month, title, totalExpenses);
  //   // addTotalMonthlyExpenses(uid, year, month, totalExpenses);
  // }, [uid, year, month, title, totalExpenses]);

  // useEffect(() => {
  //   let percentage = (totalExpenses / maxSpending) * 100;
  //   if (percentage > 100) {
  //     percentage = 100;
  //   }
  //   setSpentPercentage(Math.round(percentage));
  // }, [totalExpenses, maxSpending]);

  // console.log("TEST", title);
  // console.log("Total EX", totalExpenses);
  // console.log("TOTAL", spentPercentage);
  // console.log("EXPENSES HERE", expenses);
  return (
    <div className="flex flex-col w-full xs:max-w-[350px] bg-white rounded-3xl p-3">
      <div className="flex justify-between mb-2">
        <span>{title}</span>
        <button onClick={() => deleteCategory(uid, year, month, category)}>
          delete
        </button>
      </div>
      <div className="relative flex justify-center w-full bg-gray-300 h-6 rounded-3xl mb-7">
        <div
          className="absolute left-0 h-full rounded-3xl"
          style={{
            width: `${spentPercentage}%`,
            transition: "width 1s",
            backgroundColor: expenseColor(spentPercentage),
          }}
        ></div>
        <span className="z-10 text-gray-700">
          {totalExpenses}/{maxSpending}
        </span>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => handleAddExpense(title, expenses)}
          filled
          customClassName="mr-1"
        >
          Add Expense
        </Button>
        <Button onClick={() => handleViewExpense(title, expenses)}>
          View Expense
        </Button>
      </div>
    </div>
  );
};
