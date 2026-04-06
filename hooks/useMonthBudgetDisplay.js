import { useMemo, useState, useCallback } from "react";
import { getBudgetProgressData } from "../helperFunctions/getBudgetProgressData";

export function useMonthBudgetDisplay({
  monthIncome,
  totalMonthlyExpenses,
  monthlyExpectation,
}) {
  const [fullView, setFullView] = useState(false);

  const expectedProgress = useMemo(
    () => getBudgetProgressData(totalMonthlyExpenses, monthlyExpectation),
    [totalMonthlyExpenses, monthlyExpectation],
  );

  const budgetProgress = useMemo(
    () => getBudgetProgressData(totalMonthlyExpenses, monthIncome),
    [totalMonthlyExpenses, monthIncome],
  );

  const toggleFullView = useCallback(() => {
    setFullView((prev) => !prev);
  }, []);

  return {
    fullView,
    toggleFullView,
    expectedProgress,
    budgetProgress,
    expectedPercentage: expectedProgress.percentage,
    budgetPercentage: budgetProgress.percentage,
  };
}
