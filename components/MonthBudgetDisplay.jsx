import { Transition } from "@headlessui/react";
import React, { useState } from "react";
import { expenseColor } from "../helperFunctions/expenseColor";
import { ChevronDoubleUpSvg } from "./svg/ChevronDoubleUpSvg";

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
      className={`flex flex-col items-center z-10 cursor-pointer w-full bg-white rounded-3xl ${
        !fullView ? "p-2" : "p-4"
      }`}
      onClick={handleClickEvent}
    >
      <span
        className={`transition transform duration-500 ${
          fullView ? "rotate-180" : "rotate-0"
        }`}
      >
        <ChevronDoubleUpSvg />
      </span>
      <Transition
        show={fullView}
        enter="transition-all transform duration-300"
        enterFrom="translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-full opacity-0"
        className="w-full mb-4"
      >
        <span className="mr-3">Expected Month Expenses:</span>
        <div className="relative flex justify-center w-full bg-gray-300 h-6 rounded-3xl">
          <div
            className="absolute left-0 h-full rounded-3xl"
            style={{
              width: `${expectedPercentage}%`,
              transition: "width 1s",
              backgroundColor: expenseColor(expectedPercentage),
            }}
          ></div>
          <span className="z-10 text-gray-700">
            {totalMonthlyExpenses}/{monthlyExpectation}
          </span>
        </div>
      </Transition>
      <div className="w-full">
        <div className={`w-full ${!fullView ? "flex" : null}`}>
          <span className="mr-3">Total:</span>
          <div className="relative flex justify-center w-full bg-gray-300 h-6 rounded-3xl">
            <div
              className="absolute left-0 h-full rounded-3xl"
              style={{
                width: `${budgetPercentage}%`,
                transition: "width 1s",
                backgroundColor: expenseColor(budgetPercentage),
              }}
            ></div>
            <span className="z-10 text-gray-700">
              {totalMonthlyExpenses}/{monthIncome}
            </span>
          </div>
        </div>
      </div>

      {/* <span>
        <ChevronDoubleUpSvg />
      </span> */}
    </div>
  );
};
