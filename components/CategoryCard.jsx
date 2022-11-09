import React from "react";
import { deleteCategory } from "../firebase/firestore";
import { Button } from "./Button";

export const CategoryCard = ({
  category,
  handleAddExpense,
  handleViewExpense,
  uid,
  month,
  year,
  setIsViewExpensesModalOpen,
}) => {
  const { title, maxSpending, expenses } = category;
  return (
    <div className="flex flex-col w-full xs:max-w-[350px] bg-white rounded-3xl p-3">
      <div className="flex justify-between mb-2">
        <span>{title}</span>
        <button onClick={() => deleteCategory(uid, year, month, category)}>
          delete
        </button>
      </div>
      <div className="flex justify-center w-full bg-red-400 h-5 rounded-3xl mb-7">
        {maxSpending}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => handleAddExpense(title)}
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
