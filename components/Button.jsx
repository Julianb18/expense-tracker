import React from "react";

export const Button = ({ onClick, filled, children, customClassName }) => {
  return (
    <div
      className={`${customClassName} flex shadow-lg shadow-gray-900/10 justify-center items-center rounded-xl px-4 py-2 cursor-pointer min-w-[80px] font-medium text-sm transition-all duration-200 hover:shadow-xl hover:shadow-gray-900/20 hover:scale-105 ${
        filled
          ? "bg-gradient-to-bl from-buttonPrimary to-buttonSecondary text-white"
          : "text-buttonPrimary border border-buttonPrimary hover:bg-gradient-to-bl hover:from-buttonPrimary hover:to-buttonSecondary hover:text-white hover:border-transparent"
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
