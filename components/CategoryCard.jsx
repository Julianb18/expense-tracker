import React, { useEffect, useState } from "react";
import {
  deleteCategory,
  updateCategoryTitle,
  updateCategoryMaxSpending,
} from "../firebase/firestore";
import { expenseColor } from "../helperFunctions/expenseColor";
import { Button } from "./Button";
import { formatAmount } from "../helperFunctions/currencyFormatter";
import { DragHandleSvg } from "./svg/DragHandleSvg";

export const CategoryCard = ({
  category,
  handleAddExpense,
  handleViewExpense,
  handleCategoryDelete,
  uid,
  year,
  month,
  isEditMode = false,
}) => {
  const { title, maxSpending, expenses } = category;

  const [spentPercentage, setSpentPercentage] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingMaxSpending, setIsEditingMaxSpending] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editMaxSpending, setEditMaxSpending] = useState(maxSpending);

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

  // Update local state when props change
  useEffect(() => {
    setEditTitle(title);
    setEditMaxSpending(maxSpending);
  }, [title, maxSpending]);

  const handleTitleSave = async () => {
    if (editTitle.trim() && editTitle !== title) {
      await updateCategoryTitle(uid, year, month, title, editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleMaxSpendingSave = async () => {
    const newAmount = Number(editMaxSpending);
    if (newAmount > 0 && newAmount !== maxSpending) {
      await updateCategoryMaxSpending(uid, year, month, title, newAmount);
    }
    setIsEditingMaxSpending(false);
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setEditTitle(title);
      setIsEditingTitle(false);
    }
  };

  const handleMaxSpendingKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMaxSpendingSave();
    } else if (e.key === "Escape") {
      setEditMaxSpending(maxSpending);
      setIsEditingMaxSpending(false);
    }
  };

  return (
    <div className={`flex flex-col shadow-2xl shadow-gray-900/10 w-full xs:max-w-[400px] bg-white rounded-2xl mb-6 md:mb-0 p-4 border border-gray-100 hover:shadow-3xl hover:shadow-gray-900/20 transition-all duration-300 ${isEditMode ? 'ring-2 ring-blue-500 ring-opacity-50 active:scale-95' : ''}`}>
      <div className="flex justify-between items-center mb-3">
        {isEditMode && (
          <div className="text-gray-400 mr-2">
            <DragHandleSvg />
          </div>
        )}
        {isEditingTitle ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyPress}
            className="border border-gray-200 rounded-lg px-2 py-2 text-base flex-1 mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ fontSize: "16px" }}
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer hover:bg-gray-50 px-2 py-2 rounded-lg font-medium text-gray-800 transition-colors"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </span>
        )}
        <button
          className="border border-red-200 rounded-lg text-red-400 px-3 py-1 text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors"
          onClick={() => handleCategoryDelete(title)}
        >
          Delete
        </button>
      </div>
      <div className="relative flex justify-center w-full bg-gray-100 h-8 rounded-xl mb-6 shadow-inner">
        {isEditingMaxSpending ? (
          <div className="flex items-center z-[1] text-gray-700 font-medium">
            <span>{formatAmount(totalExpenses)}/</span>
            <input
              type="number"
              step="0.01"
              value={editMaxSpending}
              onChange={(e) => setEditMaxSpending(e.target.value)}
              onBlur={handleMaxSpendingSave}
              onKeyDown={handleMaxSpendingKeyPress}
              className="w-16 text-center border border-gray-200 rounded-lg px-2 mx-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "16px" }}
              autoFocus
            />
          </div>
        ) : (
          <span
            className="text-gray-700 z-[1] cursor-pointer hover:bg-white hover:bg-opacity-50 px-3 py-1 rounded-lg font-medium transition-colors"
            onClick={() => setIsEditingMaxSpending(true)}
          >
            {formatAmount(totalExpenses)}/{formatAmount(maxSpending)}
          </span>
        )}
        <div
          className="absolute left-0 h-full rounded-xl shadow-sm"
          style={{
            width: `${spentPercentage}%`,
            transition: "width 1s ease-in-out",
            backgroundColor: expenseColor(spentPercentage),
          }}
        ></div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => handleViewExpense(title, expenses)}>
          View Expense
        </Button>
        <Button
          onClick={() => handleAddExpense(title, expenses)}
          filled
          customClassName="ml-2"
        >
          Add Expense
        </Button>
      </div>
    </div>
  );
};
