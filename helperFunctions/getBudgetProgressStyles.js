export const getBudgetProgressStyles = (spentPercentage = 0) => {
  const safePercentage = Math.max(0, Math.min(spentPercentage, 100));

  if (spentPercentage >= 100) {
    return {
      width: `${safePercentage}%`,
      fillStyle: {
        background:
          "linear-gradient(90deg, #f87171 0%, #ef4444 55%, #e11d48 100%)",
        boxShadow: "0 0 18px rgba(248, 113, 113, 0.35)",
      },
      trackStyle: {
        background: "rgba(51, 65, 85, 0.95)",
      },
      labelClassName: "text-red-300",
    };
  }

  if (spentPercentage >= 75) {
    return {
      width: `${safePercentage}%`,
      fillStyle: {
        background:
          "linear-gradient(90deg, #fbbf24 0%, #f59e0b 55%, #fb923c 100%)",
        boxShadow: "0 0 18px rgba(251, 191, 36, 0.3)",
      },
      trackStyle: {
        background: "rgba(51, 65, 85, 0.95)",
      },
      labelClassName: "text-amber-200",
    };
  }

  return {
    width: `${safePercentage}%`,
    fillStyle: {
      background:
        "linear-gradient(90deg, #4ade80 0%, #22c55e 55%, #2dd4bf 100%)",
      boxShadow: "0 0 18px rgba(74, 222, 128, 0.28)",
    },
    trackStyle: {
      background: "rgba(51, 65, 85, 0.95)",
    },
    labelClassName: "text-emerald-200",
  };
};
