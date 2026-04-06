import React from "react";
import { AppDialog } from "./AppDialog";
import { Button } from "./Button";
import { formatCurrency } from "../helperFunctions/currencyFormatter";
import { useExpenseModal } from "../hooks/useExpenseModal";

export const ExpenseModal = ({
  uid,
  year,
  month,
  selectedCategory,
  isExpenseModalOpen,
  setIsExpenseModalOpen,
  selectedCategoryData,
}) => {
  const {
    expense,
    handleClose,
    handleSubmit,
    totalSpent,
    availableAmount,
    remainingAfterExpense,
    setTitle,
    setAmount,
    setDate,
  } = useExpenseModal({
    uid,
    year,
    month,
    selectedCategory,
    setIsExpenseModalOpen,
    selectedCategoryData,
  });

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
            onChange={(e) => setTitle(e.target.value)}
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
            onChange={(e) => setAmount(e.target.value)}
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
            onChange={(e) => setDate(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-base text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ fontSize: "16px", minWidth: "0", maxWidth: "100%" }}
          />
        </div>
      </form>
    </AppDialog>
  );
};
