import { Transition } from "@headlessui/react";
import React, { useState } from "react";
import { expenseColor } from "../helperFunctions/expenseColor";
import { ChevronDoubleUpSvg } from "./svg/ChevronDoubleUpSvg";
import { formatAmount } from "../helperFunctions/currencyFormatter";

export const MonthBudgetDisplay = ({
  monthIncome,
  totalMonthlyExpenses,
  monthlyExpectation,
}) => {
  const [fullView, setFullView] = useState(false);

  const expectedCalc = Math.round(
    (totalMonthlyExpenses / monthlyExpectation) * 100
  );

  const expectedPercentage = expectedCalc > 100 ? 100 : expectedCalc;

  const budgetCalc = Math.round((totalMonthlyExpenses / monthIncome) * 100);
  const budgetPercentage = budgetCalc > 100 ? 100 : budgetCalc;

  const handleClickEvent = () => {
    setFullView(!fullView);
  };

  return (
    <div
      className={`flex flex-col items-center shadow-2xl shadow-gray-900/20 border-2 border-gray-50 z-10 cursor-pointer w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-3xl hover:shadow-gray-900/30 hover:border-gray-400 transition-all duration-300 ${
        fullView ? "p-4 pt-3" : "p-3"
      }`}
      onClick={handleClickEvent}
    >
      {!fullView && (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1 font-medium">Spent</div>
              <div className="text-sm font-bold text-gray-900">
                {formatAmount(totalMonthlyExpenses)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1 font-medium">Budget</div>
              <div className="text-sm font-bold text-gray-900">
                {formatAmount(monthIncome)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1 font-medium">Used</div>
              <div className="text-sm font-bold text-gray-900">
                {budgetPercentage}%
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-16 h-2 bg-gray-300 rounded-full mr-3 shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${budgetPercentage}%`,
                  backgroundColor: expenseColor(budgetPercentage),
                }}
              ></div>
            </div>
            <span
              className={`transition transform duration-500 text-gray-700 hover:text-gray-900 ${
                fullView ? "rotate-180" : "rotate-0"
              }`}
            >
              <ChevronDoubleUpSvg />
            </span>
          </div>
        </div>
      )}
      
      <Transition
        show={fullView}
        as="div"
        enter="transition-all transform duration-300"
        enterFrom="translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-full opacity-0"
        className="w-full"
      >
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2 font-medium">Expected Month Expenses</div>
              <div className="relative flex justify-center w-full bg-gray-100 h-8 rounded-xl shadow-inner">
                <div
                  className="absolute left-0 h-full rounded-xl shadow-sm"
                  style={{
                    width: `${expectedPercentage}%`,
                    transition: "width 1s ease-in-out",
                    backgroundColor: expenseColor(expectedPercentage),
                  }}
                ></div>
                <span className="z-10 text-gray-700 font-medium flex items-center">
                  {formatAmount(totalMonthlyExpenses)}/{formatAmount(monthlyExpectation)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {expectedPercentage}% of expected budget
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2 font-medium">Total Monthly Spending</div>
              <div className="relative flex justify-center w-full bg-gray-100 h-8 rounded-xl shadow-inner">
                <div
                  className="absolute left-0 h-full rounded-xl shadow-sm"
                  style={{
                    width: `${budgetPercentage}%`,
                    transition: "width 1s ease-in-out",
                    backgroundColor: expenseColor(budgetPercentage),
                  }}
                ></div>
                <span className="z-10 text-gray-700 font-medium flex items-center">
                  {formatAmount(totalMonthlyExpenses)}/{formatAmount(monthIncome)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {budgetPercentage}% of total income
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};
