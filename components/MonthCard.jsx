import React from "react";

export const MonthCard = ({
  month,
  income,
  totalMonthlyExpenses,
  customCss,
}) => {
  return (
    <div
      className={`w-full max-w-[550px] sm:w-[350px] md:w-[450px] rounded-3xl shadow-gray-500 shadow-md mb-6 md:mb-0 ${customCss}`}
    >
      <div className="text-center py-3 bg-primaryDark rounded-t-3xl">
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
