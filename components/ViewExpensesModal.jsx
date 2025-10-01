import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { addCategory, addExpense, deleteExpense } from "../firebase/firestore";
import { Button } from "./Button";
import { DeleteSvg } from "./svg/DeleteSvg";
import { XMarkSvg } from "./svg/XMarkSvg";
import { formatCurrency } from "../helperFunctions/currencyFormatter";

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

  // Format date for display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog
      className="absolute overflow-hidden z-30 min-w-[90%] max-w-[500px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl h-[400px]"
      open={isViewExpensesModalOpen}
      onClose={() => setIsViewExpensesModalOpen(false)}
    >
      <Dialog.Panel className="flex flex-col h-full">
        <div className="relative flex items-center justify-between px-3 pt-3 pb-2 mb-2 flex-shrink-0">
          <Dialog.Title>{selectedCategory} - Expenses</Dialog.Title>
          <button
            className="cursor-pointer p-1"
            onClick={() => setIsViewExpensesModalOpen(false)}
          >
            <XMarkSvg />
          </button>
          <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-400"></span>
        </div>

        <div className="flex flex-col pb-3 overflow-y-auto flex-1 min-h-0">
          {selectedExpenses?.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center py-3 px-3 even:bg-gray-100 last:rounded-b-xl flex-shrink-0"
            >
              <div className="flex flex-col">
                <span className="font-medium">{expense.title}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(expense.date)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-4 text-red-400 font-medium">
                  -{formatCurrency(expense.amount)}
                </span>
                <button 
                  onClick={(e) => handleDelete(e, expense.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <DeleteSvg />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
