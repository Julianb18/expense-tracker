import React, { useEffect, useMemo, useState } from "react";
import {
  updateCategoryTitle,
  updateCategoryMaxSpending,
} from "../firebase/firestore";
import { getBudgetProgressStyles } from "../helperFunctions/getBudgetProgressStyles";
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
  isDragging = false,
}) => {
  const { title, maxSpending, expenses } = category;

  const [spentPercentage, setSpentPercentage] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingMaxSpending, setIsEditingMaxSpending] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editMaxSpending, setEditMaxSpending] = useState(maxSpending);

  useEffect(() => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const percentage =
      maxSpending > 0
        ? Math.min(Math.round((total / maxSpending) * 100), 100)
        : 0;

    setTotalExpenses(total);
    setSpentPercentage(percentage);
  }, [expenses, maxSpending]);

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
    if (e.key === "Enter") handleTitleSave();
    if (e.key === "Escape") {
      setEditTitle(title);
      setIsEditingTitle(false);
    }
  };

  const handleMaxSpendingKeyPress = (e) => {
    if (e.key === "Enter") handleMaxSpendingSave();
    if (e.key === "Escape") {
      setEditMaxSpending(maxSpending);
      setIsEditingMaxSpending(false);
    }
  };

  const progress = useMemo(
    () => getBudgetProgressStyles(spentPercentage),
    [spentPercentage],
  );

  return (
    <div
      className={`flex w-full flex-col rounded-2xl border border-slate-700 bg-slate-800/90 p-4 shadow-2xl shadow-black/20 transition-all duration-300 xs:max-w-[400px] md:mb-0 ${
        isEditMode ? "ring-2 ring-indigo-500/50 active:scale-95" : ""
      } ${isDragging ? "scale-105 shadow-indigo-500/20" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          {isEditMode && (
            <div className="mr-2 text-slate-400">
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
              className="mr-3 flex-1 rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-base text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ fontSize: "16px" }}
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer rounded-lg px-2 py-2 font-semibold text-white transition hover:bg-white/5"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </span>
          )}
        </div>

        <button
          className="rounded-lg px-3 py-1 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          onClick={() => handleCategoryDelete(title)}
        >
          Delete
        </button>
      </div>

      <div
        className="relative mb-6 h-6 w-full rounded-2xl overflow-hidden"
        style={progress.trackStyle}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-2xl transition-all duration-700"
          style={{
            width: progress.width,
            ...progress.fillStyle,
          }}
        />

        <div className="relative z-[1] flex h-full items-center justify-center">
          {isEditingMaxSpending ? (
            <div className="flex items-center font-medium text-white">
              <span>{formatAmount(totalExpenses)}/</span>
              <input
                type="number"
                step="0.01"
                value={editMaxSpending}
                onChange={(e) => setEditMaxSpending(e.target.value)}
                onBlur={handleMaxSpendingSave}
                onKeyDown={handleMaxSpendingKeyPress}
                className="mx-1 w-20 rounded-lg border border-slate-600 bg-slate-900/80 px-2 py-1 text-center text-base text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ fontSize: "16px" }}
                autoFocus
              />
            </div>
          ) : (
            <span
              className="cursor-pointer rounded-lg px-3 py-1 font-medium text-slate-100 transition hover:bg-white/5"
              onClick={() => setIsEditingMaxSpending(true)}
            >
              {formatAmount(totalExpenses)}/{formatAmount(maxSpending)}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={() => handleViewExpense(title, expenses)}
        >
          View Expense
        </Button>

        <Button
          onClick={() => handleAddExpense(title, expenses)}
          filled
        >
          Add Expense
        </Button>
      </div>
    </div>
  );
};
