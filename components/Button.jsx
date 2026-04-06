import React from "react";

export const Button = ({
  onClick,
  filled = false,
  children,
  customClassName = "",
  type = "button",
  disabled = false,
}) => {
  const variantClasses = filled
    ? "bg-buttonPrimary/90 text-white hover:bg-buttonPrimary shadow-[0_8px_18px_rgba(79,70,229,0.25)]"
    : "border border-buttonPrimary bg-buttonPrimary/10 text-indigo-300 hover:bg-buttonPrimary/20 hover:border-buttonPrimary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-w-[80px] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${variantClasses} ${customClassName} ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
};
