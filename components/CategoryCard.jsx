import React, { useEffect, useState } from "react";
import { deleteCategory } from "../firebase/firestore";
import { expenseColor } from "../helperFunctions/expenseColor";
import { Button } from "./Button";

export const CategoryCard = ({
  category,
  handleAddExpense,
  handleViewExpense,
  handleCategoryDelete,
}) => {
  const { title, maxSpending, expenses } = category;

  const [spentPercentage, setSpentPercentage] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);

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

  return (
    <div className="flex flex-col shadow-xl shadow-primaryDark w-full xs:max-w-[350px] bg-white rounded-3xl mb-6 md:mb-0 p-3">
      <div className="flex justify-between mb-2">
        <span>{title}</span>
        <button
          className="border border-gray-400 rounded-3xl text-gray-400 px-2"
          onClick={() => handleCategoryDelete(title)}
        >
          delete
        </button>
      </div>
      <div className="relative flex justify-center w-full bg-gray-300 h-6 rounded-3xl mb-7">
        <span className="text-gray-700 z-[1]">
          {totalExpenses}/{maxSpending}
        </span>
        <div
          className="absolute left-0 h-full rounded-3xl"
          style={{
            width: `${spentPercentage}%`,
            transition: "width 1s",
            backgroundColor: expenseColor(spentPercentage),
          }}
        ></div>
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
