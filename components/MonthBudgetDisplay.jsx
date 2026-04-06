import React from "react";
import { useMonthBudgetDisplay } from "../hooks/useMonthBudgetDisplay";
import { ChevronDoubleUpSvg } from "./svg/ChevronDoubleUpSvg";
import { formatAmount } from "../helperFunctions/currencyFormatter";

export const MonthBudgetDisplay = ({
  monthIncome,
  totalMonthlyExpenses,
  monthlyExpectation,
}) => {
  const {
    fullView,
    toggleFullView,
    expectedPercentage,
    budgetPercentage,
    expectedProgress,
    budgetProgress,
  } = useMonthBudgetDisplay({
    monthIncome,
    totalMonthlyExpenses,
    monthlyExpectation,
  });

  return (
    <div
      className={`z-10 flex w-full cursor-pointer flex-col items-center rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl shadow-black/20 transition-[padding,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-slate-600 hover:shadow-black/30 ${
        fullView ? "p-4 pt-3" : "p-3"
      }`}
      onClick={toggleFullView}
    >
      <div
        className={`grid w-full transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          fullView ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`flex w-full items-center space-x-4 transition duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              fullView
                ? "-translate-y-1 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex flex-1 items-center space-x-6 md:space-x-8">
              <div className="flex flex-col items-center">
                <span className="mb-1 text-xs font-medium text-slate-400">
                  Spent
                </span>
                <span className="text-sm font-bold text-white">
                  {formatAmount(totalMonthlyExpenses)}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="mb-1 text-xs font-medium text-slate-400">
                  Budget
                </span>
                <span className="text-sm font-bold text-white">
                  {formatAmount(monthIncome)}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="mb-1 text-xs font-medium text-slate-400">
                  Used
                </span>
                <span
                  className={`text-sm font-bold text-white ${budgetProgress.labelClassName}`}
                >
                  {budgetPercentage}%
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-center">
              <div
                className="mr-3 h-2 flex-1 rounded-full shadow-inner overflow-hidden"
                style={budgetProgress.trackStyle}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: budgetProgress.width,
                    ...budgetProgress.fillStyle,
                  }}
                />
              </div>

              <span className="flex-shrink-0 text-slate-400 transition hover:text-white">
                <ChevronDoubleUpSvg />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid w-full transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          fullView ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`flex flex-col space-y-4 transition duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              fullView
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 scale-[0.99] opacity-0"
            }`}
          >
            <span className="mx-auto rotate-180 text-slate-400 transition hover:text-white">
              <ChevronDoubleUpSvg />
            </span>

            <div className="rounded-2xl border border-indigo-500/25 bg-indigo-500/20 p-4 shadow-[0_0_20px_rgba(99,102,241,0.08)]">
              <div className="text-center">
                <p className="mb-2 text-sm font-medium text-slate-300">
                  Expected Month Expenses
                </p>

                <div
                  className="relative flex h-8 w-full justify-center rounded-xl shadow-inner overflow-hidden"
                  style={expectedProgress.trackStyle}
                >
                  <div
                    className="absolute left-0 h-full rounded-xl transition-all duration-700"
                    style={{
                      width: expectedProgress.width,
                      ...expectedProgress.fillStyle,
                    }}
                  />

                  <span className="z-10 flex items-center font-medium text-white">
                    {formatAmount(totalMonthlyExpenses)}/
                    {formatAmount(monthlyExpectation)}
                  </span>
                </div>

                <span
                  className={`mt-2 text-xs text-slate-300 ${expectedProgress.labelClassName}`}
                >
                  {expectedPercentage}% of expected budget
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <div className="text-center">
                <p className="mb-2 text-sm font-medium text-slate-300">
                  Total Monthly Spending
                </p>

                <div
                  className="relative flex h-8 w-full justify-center rounded-xl shadow-inner overflow-hidden"
                  style={budgetProgress.trackStyle}
                >
                  <div
                    className="absolute left-0 h-full rounded-xl transition-all duration-700"
                    style={{
                      width: budgetProgress.width,
                      ...budgetProgress.fillStyle,
                    }}
                  />

                  <span className="z-10 flex items-center font-medium text-white">
                    {formatAmount(totalMonthlyExpenses)}/
                    {formatAmount(monthIncome)}
                  </span>
                </div>

                <span
                  className={`mt-2 text-xs text-slate-300 ${budgetProgress.labelClassName}`}
                >
                  {budgetPercentage}% of total income
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
