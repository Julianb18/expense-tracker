import React from "react";
import { AppDialog } from "./AppDialog";
import { DeleteSvg } from "./svg/DeleteSvg";
import { formatCurrency } from "../helperFunctions/currencyFormatter";

import { deleteExpense } from "../firebase/firestore";

export const ViewExpensesModal = ({
  uid,
  year,
  month,
  selectedCategory,
  isViewExpensesModalOpen,
  setIsViewExpensesModalOpen,
  selectedExpenses,
  setSelectedExpenses,
}) => {
  const handleDelete = (e, expenseId) => {
    e.preventDefault();

    deleteExpense(uid, year, month, selectedCategory, expenseId);

    setSelectedExpenses(selectedExpenses.filter((e) => e.id !== expenseId));
  };

  const handleClose = () => {
    setIsViewExpensesModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const sortedExpenses = [...(selectedExpenses || [])].sort((a, b) => {
    const expenseDateA = new Date(a.date || 0).getTime();
    const expenseDateB = new Date(b.date || 0).getTime();

    if (expenseDateB !== expenseDateA) {
      return expenseDateB - expenseDateA;
    }

    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  return (
    <AppDialog
      open={isViewExpensesModalOpen}
      onClose={handleClose}
      title={`${selectedCategory} - Expenses`}
      maxWidthClassName="max-w-[500px]"
    >
      <div className="space-y-3">
        {sortedExpenses.length === 0 ? (
          <div className="py-8 text-center text-slate-400">No expenses yet</div>
        ) : (
          sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/50 p-3 transition hover:bg-slate-900/70"
            >
              <div className="flex flex-col">
                <span className="font-medium text-white">{expense.title}</span>
                <span className="text-sm text-slate-400">
                  {formatDate(expense.date)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium text-red-400">
                  -{formatCurrency(expense.amount)}
                </span>

                <button
                  onClick={(e) => handleDelete(e, expense.id)}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <DeleteSvg />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AppDialog>
  );
};
