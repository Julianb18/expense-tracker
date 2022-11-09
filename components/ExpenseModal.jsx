import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";

import { addCategory, addExpense } from "../firebase/firestore";
import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";

export const ExpenseModal = ({
  uid,
  year,
  month,
  selectedCategory,
  isExpenseModalOpen,
  setIsExpenseModalOpen,
}) => {
  const [expense, setExpense] = useState({
    title: "",
    amount: 0,
    id: uuid(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempExpense = { ...expense, id: uuid() };
    if (expense.title !== "" && expense.amount !== 0) {
      addExpense(uid, year, month, selectedCategory, tempExpense);
      setIsExpenseModalOpen(false);
      console.log("submitted");
    }
    setExpense(tempExpense);
    console.log("not submitted");
  };
  return (
    <Dialog
      className="absolute min-w-[300px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-3xl"
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
            <div className="">
              <label htmlFor="title">Title/Description</label>
              <input
                onChange={(e) =>
                  setExpense({ ...expense, title: e.target.value })
                }
                value={expense.title}
                className="w-full border border-black rounded-3xl pl-3 py-1"
                type="text"
                name="title"
              />
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <input
                onChange={(e) =>
                  setExpense({ ...expense, amount: e.target.value })
                }
                value={expense.amount}
                onFocus={(e) => (e.target.value = "")}
                className="w-full border border-black rounded-3xl pl-3 py-1"
                type="number"
                name="amount"
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
