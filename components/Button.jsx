import React from "react";

export const Button = ({ onClick, filled, children, customClassName, customColor }) => {
  const getButtonStyles = () => {
    if (customColor) {
      // Map common colors to their Tailwind classes
      const colorMap = {
        'red-400': 'red-400',
        'red-500': 'red-500',
        'red-600': 'red-600',
        'blue-400': 'blue-400',
        'blue-500': 'blue-500',
        'blue-600': 'blue-600',
        'green-400': 'green-400',
        'green-500': 'green-500',
        'green-600': 'green-600',
        'yellow-400': 'yellow-400',
        'yellow-500': 'yellow-500',
        'purple-400': 'purple-400',
        'purple-500': 'purple-500',
        'purple-600': 'purple-600',
        'gray-400': 'gray-400',
        'gray-500': 'gray-500',
        'gray-600': 'gray-600',
      };

      const colorClass = colorMap[customColor] || customColor;
      
      return filled
        ? `bg-${colorClass} text-white hover:bg-${colorClass} hover:opacity-90`
        : `text-${colorClass} border border-${colorClass} hover:bg-${colorClass} hover:text-white hover:border-transparent`;
    }
    
    return filled
      ? "bg-gradient-to-bl from-buttonPrimary to-buttonSecondary text-white"
      : "text-buttonPrimary border border-buttonPrimary hover:bg-gradient-to-bl hover:from-buttonPrimary hover:to-buttonSecondary hover:text-white hover:border-transparent";
  };

  return (
    <div
      className={`${customClassName} flex shadow-lg shadow-gray-900/10 justify-center items-center rounded-xl px-4 py-2 cursor-pointer min-w-[80px] font-medium text-sm transition-all duration-200 hover:shadow-xl hover:shadow-gray-900/20 hover:scale-105 ${getButtonStyles()}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
