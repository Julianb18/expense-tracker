import React, { useState } from "react";
import { AppDialog } from "./AppDialog";
import { v4 as uuid } from "uuid";

import { Button } from "./Button";

import { addExpense } from "../firebase/firestore";
import { formatCurrency } from "../helperFunctions/currencyFormatter";

export const ExpenseModal = ({
  uid,
  year,
  month,
  selectedCategory,
  isExpenseModalOpen,
  setIsExpenseModalOpen,
  selectedCategoryData,
}) => {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    id: uuid(),
    date: new Date().toISOString().split("T")[0],
  });

  const resetExpense = () => {
    setExpense({
      title: "",
      amount: "",
      id: uuid(),
      date: new Date().toISOString().split("T")[0],
      createdAt: Date.now(),
    });
  };

  const handleClose = () => {
    setIsExpenseModalOpen(false);
    resetExpense();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const tempExpense = {
      ...expense,
      id: uuid(),
      createdAt: Date.now(),
    };

    if (
      tempExpense.title !== "" &&
      tempExpense.amount !== "" &&
      Number(tempExpense.amount) > 0
    ) {
      addExpense(uid, year, month, selectedCategory, {
        ...tempExpense,
        amount: Number(tempExpense.amount),
      });

      setIsExpenseModalOpen(false);
      resetExpense();
    }
  };

  const totalSpent =
    selectedCategoryData?.expenses?.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    ) || 0;

  const getAvailableAmount = () => {
    if (!selectedCategoryData) return 0;
    return selectedCategoryData.maxSpending - totalSpent;
  };

  const availableAmount = getAvailableAmount();

  const getRemainingAfterExpense = () => {
    const currentExpenseAmount = parseFloat(expense.amount) || 0;
    return availableAmount - currentExpenseAmount;
  };

  const remainingAfterExpense = getRemainingAfterExpense();

  return (
    <AppDialog
      open={isExpenseModalOpen}
      onClose={handleClose}
      title="New Expense"
      maxWidthClassName="max-w-[500px]"
      footer={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button filled onClick={handleSubmit}>
            Add
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 text-center">
          <div className="mb-2 text-sm font-medium text-slate-300">
            Remaining budget in {selectedCategory}
          </div>

          <div
            className={`text-xl font-bold transition-colors duration-200 ${
              remainingAfterExpense >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatCurrency(remainingAfterExpense)}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            {`${formatCurrency(
              totalSpent + (parseFloat(expense.amount) || 0),
            )} / ${formatCurrency(selectedCategoryData?.maxSpending || 0)}`}
          </div>

          {expense.amount && parseFloat(expense.amount) > 0 && (
            <div className="mt-2 border-t border-slate-700 pt-2 text-xs text-slate-400">
              Current remaining: {formatCurrency(availableAmount)}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Title/Description
          </label>

          <input
            id="title"
            type="text"
            name="title"
            value={expense.title}
            onChange={(e) => setExpense({ ...expense, title: e.target.value })}
            className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ fontSize: "16px" }}
            placeholder="Enter expense description"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Amount
          </label>

          <input
            id="amount"
            type="number"
            step="0.01"
            name="amount"
            value={expense.amount}
            onChange={(e) =>
              setExpense({
                ...expense,
                amount: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ fontSize: "16px" }}
            placeholder="Enter amount (e.g. 12.50)"
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            name="date"
            value={expense.date}
            onChange={(e) =>
              setExpense({
                ...expense,
                date: e.target.value,
              })
            }
            className="w-full appearance-none rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ fontSize: "16px", minWidth: "0", maxWidth: "100%" }}
          />
        </div>
      </form>
    </AppDialog>
  );
};
