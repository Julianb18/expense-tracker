import React from "react";

export const MonthCard = ({ month, income }) => {
  return (
    <div className="w-full max-w-[350px] sm:w-[350px] xs:min-h-[150px] h-52 bg-stone-400 rounded-3xl">
      <div className="text-center bg-blue-400 py-1 rounded-t-3xl">{month}</div>
      <div className="">
        <span>Income: {income}</span>
      </div>
    </div>
  );
};
