import React from "react";

export const Button = ({ onClick, filled, children, customClassName }) => {
  return (
    <div
      className={`${customClassName} flex justify-center items-center rounded-3xl px-2 py-1 cursor-pointer min-w-[65px] ${
        filled
          ? "bg-blue-400 text-white"
          : " text-blue-400 border border-blue-400"
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
