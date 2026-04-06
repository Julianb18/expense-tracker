export const getBudgetProgressStyles = (spentPercentage = 0) => {
  const safePercentage = Math.max(0, Math.min(spentPercentage, 100));

  const baseTrackStyle = {
    background:
      "linear-gradient(180deg, rgba(51,65,85,0.95) 0%, rgba(37,49,66,0.98) 100%)",
    boxShadow:
      "inset 0 1px 1px rgba(255,255,255,0.04), inset 0 -2px 6px rgba(0,0,0,0.35)",
  };

  const fillBase = {
    boxShadow:
      "inset 0 1px 1px rgba(255,255,255,0.10), inset 0 -1px 2px rgba(0,0,0,0.15)",
  };

  if (spentPercentage >= 100) {
    return {
      percentage: safePercentage,
      fillStyle: {
        background:
          "linear-gradient(90deg, #d96a6a 0%, #cf5b5b 55%, #c94f4f 100%)",
        ...fillBase,
      },
      trackStyle: baseTrackStyle,
      labelClassName: "text-red-200",
    };
  }

  if (spentPercentage >= 75) {
    return {
      percentage: safePercentage,
      fillStyle: {
        background:
          "linear-gradient(90deg, #cfa56a 0%, #c29257 55%, #b98547 100%)",
        ...fillBase,
      },
      trackStyle: baseTrackStyle,
      labelClassName: "text-amber-200",
    };
  }

  return {
    percentage: safePercentage,
    fillStyle: {
      background:
        "linear-gradient(90deg, #43c792 0%, #35b889 55%, #2fa27f 100%)",
      ...fillBase,
    },
    trackStyle: baseTrackStyle,
    labelClassName: "text-emerald-200",
  };
};
