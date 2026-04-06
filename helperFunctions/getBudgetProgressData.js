import { getBudgetProgressStyles } from "./getBudgetProgressStyles";

export const getBudgetProgressData = (value, maxValue) => {
  const safeValue = Number(value) || 0;
  const safeMaxValue = Number(maxValue) || 0;

  const percentage =
    safeMaxValue > 0
      ? Math.min(Math.round((safeValue / safeMaxValue) * 100), 100)
      : 0;

  return {
    value: safeValue,
    maxValue: safeMaxValue,
    percentage,
    progressStyles: getBudgetProgressStyles(percentage),
  };
};
