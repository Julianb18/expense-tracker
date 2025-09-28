import React, { useEffect, useState } from "react";
import { deleteCategory, updateCategoryTitle, updateCategoryMaxSpending } from "../firebase/firestore";
import { expenseColor } from "../helperFunctions/expenseColor";
import { Button } from "./Button";

export const CategoryCard = ({
  category,
  handleAddExpense,
  handleViewExpense,
  handleCategoryDelete,
  uid,
  year,
  month,
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
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(title);
      setIsEditingTitle(false);
    }
  };

  const handleMaxSpendingKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMaxSpendingSave();
    } else if (e.key === 'Escape') {
      setEditMaxSpending(maxSpending);
      setIsEditingMaxSpending(false);
    }
  };

  return (
    <div className="flex flex-col shadow-xl shadow-primaryDark w-full xs:max-w-[350px] bg-white rounded-3xl mb-6 md:mb-0 p-3">
      <div className="flex justify-between mb-2">
        {isEditingTitle ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyPress}
            className="border border-gray-300 rounded px-2 py-1 text-base flex-1 mr-2"
            style={{ fontSize: '16px' }}
            autoFocus
          />
        ) : (
          <span 
            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </span>
        )}
        <button
          className="border border-gray-400 rounded-3xl text-gray-400 px-2"
          onClick={() => handleCategoryDelete(title)}
        >
          delete
        </button>
      </div>
      <div className="relative flex justify-center w-full bg-gray-300 h-6 rounded-3xl mb-7">
        {isEditingMaxSpending ? (
          <div className="flex items-center z-[1] text-gray-700">
            <span>{totalExpenses}/</span>
            <input
              type="number"
              value={editMaxSpending}
              onChange={(e) => setEditMaxSpending(e.target.value)}
              onBlur={handleMaxSpendingSave}
              onKeyDown={handleMaxSpendingKeyPress}
              className="w-16 text-center border border-gray-300 rounded px-1 mx-1 text-base"
              style={{ fontSize: '16px' }}
              autoFocus
            />
          </div>
        ) : (
          <span 
            className="text-gray-700 z-[1] cursor-pointer hover:bg-gray-400 hover:bg-opacity-30 px-2 rounded"
            onClick={() => setIsEditingMaxSpending(true)}
          >
            {totalExpenses}/{maxSpending}
          </span>
        )}
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
