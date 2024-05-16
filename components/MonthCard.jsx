import React from "react";

export const MonthCard = ({
  month,
  income,
  totalMonthlyExpenses,
  customCss,
}) => {
  return (
    <div
      className={`w-full max-w-[350px] sm:w-[350px] rounded-3xl shadow-gray-800 shadow-lg mb-6 md:mb-0 ${customCss}`}
    >
      <div className="text-center bg-white bg-opacity-20 py-1 rounded-t-3xl">
        <h2 className="text-white">{month}</h2>
      </div>
      <div className="flex justify-center bg-white rounded-b-3xl px-4 py-4">
        <div className="flex flex-col w-[90%]">
          <div className="flex justify-between">
            Income: <span>{income}</span>
          </div>
          <div className="flex justify-between">
            Expense: <span>{totalMonthlyExpenses}</span>
          </div>
          <div className="flex justify-between mt-3">
            Saved: <span>{income - totalMonthlyExpenses}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
