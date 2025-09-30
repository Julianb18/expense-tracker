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
      console.log("submitted");
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

  // Calculate available amount
  const getAvailableAmount = () => {
    if (!selectedCategoryData) return 0;

    return selectedCategoryData.maxSpending - totalSpent;
  };

  const availableAmount = getAvailableAmount();

  return (
    <Dialog
      className="absolute z-30 min-w-[90%] max-w-[500px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl"
      open={isExpenseModalOpen}
      onClose={() => setIsExpenseModalOpen(false)}
    >
      <form onSubmit={handleSubmit}>
        <Dialog.Panel className="flex flex-col space-y-4">
          <div className="relative flex items-center justify-between px-3 pt-3 pb-2 mb-2">
            <Dialog.Title>New Expense</Dialog.Title>
            <button
              className="cursor-pointer p-1"
              onClick={() => setIsExpenseModalOpen(false)}
            >
              <XMarkSvg />
            </button>
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-400"></span>
          </div>
          <div className="space-y-4 px-3">
            {/* Available Amount Display */}
            <div className="bg-gray-100 rounded-2xl p-3 text-center">
              <div className="text-sm text-gray-600 mb-1">
                Remaining budget in {selectedCategory}
              </div>
              <div
                className={`text-lg font-semibold ${
                  availableAmount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(availableAmount)}
              </div>
              <div className="text-xs text-gray-500">
                {`${formatCurrency(totalSpent)} / ${formatCurrency(
                  selectedCategoryData?.maxSpending || 0
                )}`}
              </div>
            </div>

            <div className="">
              <label htmlFor="title">Title/Description</label>
              <input
                onChange={(e) =>
                  setExpense({ ...expense, title: e.target.value })
                }
                value={expense.title}
                onFocus={(e) => (e.target.value = "")}
                className="w-full border border-black rounded-3xl pl-3 py-1 text-base"
                style={{ fontSize: "16px" }}
                type="text"
                name="title"
                placeholder="Enter expense description"
              />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
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
                className="w-full border border-black rounded-3xl pl-3 py-1 text-base"
                style={{ fontSize: "16px" }}
                name="amount"
                placeholder="Enter amount (e.g., 12.50)"
              />
            </div>
            <div>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                onChange={(e) =>
                  setExpense({
                    ...expense,
                    date: e.target.value,
                  })
                }
                value={expense.date}
                className="w-full border border-black rounded-3xl pl-3 pr-4 py-1 text-base"
                style={{ fontSize: "16px" }}
                name="date"
              />
            </div>
          </div>
          <div className="flex justify-end px-3 pb-3">
            <Button filled customClassName="mr-1" onClick={handleSubmit}>
              Add
            </Button>
          </div>
        </Dialog.Panel>
      </form>
    </Dialog>
  );
};
