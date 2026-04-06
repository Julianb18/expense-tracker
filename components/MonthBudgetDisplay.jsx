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

  const expectedCalc =
    monthlyExpectation && totalMonthlyExpenses
      ? Math.round((totalMonthlyExpenses / monthlyExpectation) * 100)
      : 0;

  const expectedPercentage = expectedCalc > 100 ? 100 : expectedCalc;

  const budgetCalc =
    monthIncome && totalMonthlyExpenses
      ? Math.round((totalMonthlyExpenses / monthIncome) * 100)
      : 0;

  const budgetPercentage = budgetCalc > 100 ? 100 : budgetCalc;

  const handleClickEvent = () => {
    setFullView(!fullView);
  };

  return (
    <div
      className={`z-10 flex w-full cursor-pointer flex-col items-center rounded-2xl border border-slate-700 bg-slate-800/60 shadow-2xl shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:shadow-black/30 ${
        fullView ? "p-4 pt-3" : "p-3"
      }`}
      onClick={handleClickEvent}
    >
      {!fullView && (
        <div className="flex w-full items-center space-x-4">
          <div className="flex flex-1 items-center space-x-6 md:space-x-8">
            <div className="text-center">
              <div className="mb-1 text-xs font-medium text-slate-400">
                Spent
              </div>
              <div className="text-sm font-bold text-white">
                {formatAmount(totalMonthlyExpenses)}
              </div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-xs font-medium text-slate-400">
                Budget
              </div>
              <div className="text-sm font-bold text-white">
                {formatAmount(monthIncome)}
              </div>
            </div>

            <div className="text-center">
              <div className="mb-1 text-xs font-medium text-slate-400">
                Used
              </div>
              <div className="text-sm font-bold text-white">
                {budgetPercentage}%
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center">
            <div className="mr-3 h-2 flex-1 rounded-full bg-slate-700 shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${budgetPercentage}%`,
                  backgroundColor: expenseColor(budgetPercentage),
                }}
              />
            </div>

            <span className="flex-shrink-0 text-slate-400 transition hover:text-white">
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
        <div className="flex flex-col space-y-4">
          <span className="mx-auto rotate-180 text-slate-400 transition hover:text-white">
            <ChevronDoubleUpSvg />
          </span>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/30 p-4">
            <div className="text-center">
              <div className="mb-2 text-sm font-medium text-slate-300">
                Expected Month Expenses
              </div>

              <div className="relative flex h-8 w-full justify-center rounded-xl bg-slate-700 shadow-inner">
                <div
                  className="absolute left-0 h-full rounded-xl shadow-sm"
                  style={{
                    width: `${expectedPercentage}%`,
                    transition: "width 1s ease-in-out",
                    backgroundColor: expenseColor(expectedPercentage),
                  }}
                />

                <span className="z-10 flex items-center font-medium text-white">
                  {formatAmount(totalMonthlyExpenses)}/
                  {formatAmount(monthlyExpectation)}
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-400">
                {expectedPercentage}% of expected budget
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4">
            <div className="text-center">
              <div className="mb-2 text-sm font-medium text-slate-300">
                Total Monthly Spending
              </div>

              <div className="relative flex h-8 w-full justify-center rounded-xl bg-slate-700 shadow-inner">
                <div
                  className="absolute left-0 h-full rounded-xl shadow-sm"
                  style={{
                    width: `${budgetPercentage}%`,
                    transition: "width 1s ease-in-out",
                    backgroundColor: expenseColor(budgetPercentage),
                  }}
                />

                <span className="z-10 flex items-center font-medium text-white">
                  {formatAmount(totalMonthlyExpenses)}/
                  {formatAmount(monthIncome)}
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-400">
                {budgetPercentage}% of total income
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};
