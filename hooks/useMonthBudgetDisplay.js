import { useMemo, useState, useCallback } from "react";
import { getBudgetProgressStyles } from "../helperFunctions/getBudgetProgressStyles";

export function useMonthBudgetDisplay({
  monthIncome,
  totalMonthlyExpenses,
  monthlyExpectation,
}) {
  const [fullView, setFullView] = useState(false);

  const expectedCalc =
    monthlyExpectation && totalMonthlyExpenses
      ? Math.round((totalMonthlyExpenses / monthlyExpectation) * 100)
      : 0;

  const expectedPercentage = Math.min(expectedCalc, 100);

  const budgetCalc =
    monthIncome && totalMonthlyExpenses
      ? Math.round((totalMonthlyExpenses / monthIncome) * 100)
      : 0;

  const budgetPercentage = Math.min(budgetCalc, 100);

  const expectedProgress = useMemo(
    () => getBudgetProgressStyles(expectedPercentage),
    [expectedPercentage],
  );

  const budgetProgress = useMemo(
    () => getBudgetProgressStyles(budgetPercentage),
    [budgetPercentage],
  );

  const toggleFullView = useCallback(() => {
    setFullView((v) => !v);
  }, []);

  return {
    fullView,
    toggleFullView,
    expectedPercentage,
    budgetPercentage,
    expectedProgress,
    budgetProgress,
  };
}
