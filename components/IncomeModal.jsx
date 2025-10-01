import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

import { Button } from "./Button";
import { XMarkSvg } from "./svg/XMarkSvg";
import { formatCurrency } from "../helperFunctions/currencyFormatter";

import { addMonthIncome } from "../firebase/firestore";

export const IncomeModal = ({
  incomeModalIsOpen,
  setIncomeModalIsOpen,
  uid,
  year,
  month,
  currentIncome = 0,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [isAddMode, setIsAddMode] = useState(true); // true = add to current, false = set total

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal !== "" && Number(inputVal) > 0) {
      const amount = Number(inputVal);
      const newIncome = isAddMode ? currentIncome + amount : amount;
      addMonthIncome(uid, year, month, newIncome);
      setIncomeModalIsOpen(false);
    }
    setInputVal("");
  };

  const handleClose = () => {
    setIncomeModalIsOpen(false);
    setInputVal("");
    setIsAddMode(true);
  };

  return (
    <Dialog
      className="absolute z-30 min-w-[90%] max-w-[500px] top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl shadow-gray-900/20 border border-gray-100"
      open={incomeModalIsOpen}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit}>
        <Dialog.Panel className="flex flex-col space-y-4">
          <div className="relative flex items-center justify-between px-3 pt-3 pb-2 mb-2">
            <Dialog.Title>Manage Income</Dialog.Title>
            <button
              className="cursor-pointer p-1"
              onClick={handleClose}
            >
              <XMarkSvg />
            </button>
            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-400"></span>
          </div>

          <div className="px-3 space-y-4">
            {/* Current Income Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-200">
              <div className="text-sm text-gray-600 mb-2 font-medium">Current Income</div>
              <div className="text-xl font-bold text-blue-700">
                {formatCurrency(currentIncome)}
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setIsAddMode(true)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  isAddMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Add Amount
              </button>
              <button
                type="button"
                onClick={() => setIsAddMode(false)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  !isAddMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Set Total
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isAddMode ? 'Amount to Add' : 'Total Income Amount'}
              </label>
              <input
                type="number"
                step="0.01"
                onChange={(e) => setInputVal(e.target.value)}
                value={inputVal}
                className="w-full border border-gray-300 rounded-xl pl-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontSize: '16px' }}
                placeholder={isAddMode ? 'Enter amount to add (e.g., 500.00)' : 'Enter total income (e.g., 3000.00)'}
              />
            </div>

            {/* Preview */}
            {inputVal !== "" && Number(inputVal) > 0 && (
              <div className="bg-blue-50 rounded-2xl p-3 text-center">
                <div className="text-sm text-gray-600 mb-1">
                  {isAddMode ? 'New Total Income' : 'New Income Amount'}
                </div>
                <div className="text-lg font-semibold text-blue-700">
                  {formatCurrency(isAddMode ? currentIncome + Number(inputVal) : Number(inputVal))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 px-3 py-3">
            <Button onClick={handleClose}>Cancel</Button>
            <Button filled onClick={handleSubmit}>
              {isAddMode ? 'Add Income' : 'Update Income'}
            </Button>
          </div>
        </Dialog.Panel>
      </form>
    </Dialog>
  );
};
