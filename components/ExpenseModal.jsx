import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { v4 as uuid } from "uuid";

import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";

import { addExpense } from "../firebase/firestore";
import {
  formatAmount,
  formatCurrency,
} from "../helperFunctions/currencyFormatter";

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
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempExpense = { ...expense, id: uuid() };
    if (tempExpense.title !== "" && tempExpense.amount !== "" && tempExpense.amount > 0) {
      addExpense(uid, year, month, selectedCategory, {
        ...tempExpense,
        amount: Number(tempExpense.amount)
      });
      setIsExpenseModalOpen(false);
    }

    setExpense({
      title: "",
      amount: "",
      id: uuid(),
      date: new Date().toISOString().split('T')[0],
    });
  };

  const totalSpent =
    selectedCategoryData?.expenses?.reduce(
      (acc, curr) => acc + curr.amount,
      0
    ) || 0;

  // Calculate remaining budget for the selected category
  const getAvailableAmount = () => {
    if (!selectedCategoryData) return 0;
    return selectedCategoryData.maxSpending - totalSpent;
  };

  const availableAmount = getAvailableAmount();

  return (
    <Dialog
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      open={isExpenseModalOpen}
      onClose={() => setIsExpenseModalOpen(false)}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Panel className="relative bg-white rounded-2xl shadow-2xl shadow-gray-900/20 border border-gray-100 w-full max-w-[500px] max-h-[90vh] overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col h-full max-h-[90vh]">
          <div className="relative flex items-center justify-between px-3 pt-3 pb-2 mb-2 flex-shrink-0">
            <Dialog.Title>New Expense</Dialog.Title>
            <button
              className="cursor-pointer p-1"
              onClick={() => setIsExpenseModalOpen(false)}
            >
              <XMarkSvg />
            </button>
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-400"></span>
          </div>
          <div className="space-y-4 px-3 overflow-y-auto flex-1 min-h-0">
            {/* Available Amount Display */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 text-center border border-gray-200">
              <div className="text-sm text-gray-600 mb-2 font-medium">
                Remaining budget in {selectedCategory}
              </div>
              <div
                className={`text-xl font-bold ${
                  availableAmount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(availableAmount)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {`${formatCurrency(totalSpent)} / ${formatCurrency(
                  selectedCategoryData?.maxSpending || 0
                )}`}
              </div>
            </div>

            <div className="">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title/Description</label>
              <input
                onChange={(e) =>
                  setExpense({ ...expense, title: e.target.value })
                }
                value={expense.title}
                onFocus={(e) => (e.target.value = "")}
                className="w-full border border-gray-300 rounded-xl pl-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontSize: "16px" }}
                type="text"
                name="title"
                placeholder="Enter expense description"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                onChange={(e) =>
                  setExpense({
                    ...expense,
                    amount: e.target.value,
                  })
                }
                value={expense.amount}
                className="w-full border border-gray-300 rounded-xl pl-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontSize: "16px" }}
                name="amount"
                placeholder="Enter amount (e.g., 12.50)"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setExpense({
                    ...expense,
                    date: e.target.value,
                  })
                }
                value={expense.date}
                className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                style={{ fontSize: "16px", minWidth: "0", maxWidth: "100%" }}
                name="date"
              />
            </div>
          </div>
          <div className="flex justify-end px-3 py-3 flex-shrink-0">
            <Button filled customClassName="mr-1" onClick={handleSubmit}>
              Add
            </Button>
          </div>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};
