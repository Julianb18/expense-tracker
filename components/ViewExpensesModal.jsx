import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { addCategory, addExpense, deleteExpense } from "../firebase/firestore";
import { Button } from "./Button";
import { DeleteSvg } from "./svg/DeleteSvg";
import { XMarkSvg } from "./svg/XMarkSvg";

export const ViewExpensesModal = ({
  uid,
  year,
  month,
  selectedCategory,
  isViewExpensesModalOpen,
  setIsViewExpensesModalOpen,
  selectedExpenses,
}) => {
  console.log("HERE", selectedExpenses);

  const handleSubmit = (e, expenseId) => {
    e.preventDefault();
    console.log(expenseId);
    deleteExpense(uid, year, month, selectedCategory, expenseId);
  };
  return (
    <Dialog
      className="absolute min-w-[90%] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl"
      open={isViewExpensesModalOpen}
      onClose={() => setIsViewExpensesModalOpen(false)}
    >
      <Dialog.Panel className="flex flex-col space-y-4">
        <div className="relative flex items-center justify-between px-3 pt-3 pb-2 mb-2">
          <Dialog.Title>Expenses</Dialog.Title>
          <button
            className="cursor-pointer p-1"
            onClick={() => setIsViewExpensesModalOpen(false)}
          >
            <XMarkSvg />
          </button>
          <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-400"></span>
        </div>

        <div className="flex flex-col pb-3">
          {selectedExpenses?.map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between py-2 px-3 even:bg-gray-100"
            >
              <span>{expense.title}</span>
              <div className="flex justify-center">
                <span className="mr-7">{expense.amount}</span>
                <button onClick={(e) => handleSubmit(e, expense.id)}>
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
