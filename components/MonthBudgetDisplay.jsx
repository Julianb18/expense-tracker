import React from "react";

export const MonthBudgetDisplay = ({ monthIncome }) => {
  return (
    <div className="flex w-full bg-white rounded-3xl p-2">
      <span className="mr-3">Total:</span>
      <div className="flex text-sm justify-center items-center w-full rounded-3xl bg-slate-300">
        <span>{monthIncome}</span>
      </div>
    </div>
  );
};
