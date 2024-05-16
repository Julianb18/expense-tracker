import React from "react";

export const Button = ({ onClick, filled, children, customClassName }) => {
  return (
    <div
      className={`${customClassName} flex shadow-lg shadow-primaryDark justify-center items-center rounded-3xl px-2 py-1 cursor-pointer min-w-[65px] ${
        filled
          ? "bg-gradient-to-bl from-buttonPrimary to-buttonSecondary text-white"
          : " text-buttonPrimary border border-buttonPrimary"
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
