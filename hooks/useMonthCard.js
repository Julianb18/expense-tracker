import { useMemo, useState, useCallback } from "react";
import {
  generateChartColors,
  ensureContrast,
} from "../helperFunctions/chartColors";
import { formatCurrency } from "../helperFunctions/currencyFormatter";

export function useMonthCard({
  income,
  totalMonthlyExpenses,
  categories = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const dynamicColors = useMemo(
    () => ensureContrast(generateChartColors(categories.length)),
    [categories.length],
  );

  const chartData = useMemo(
    () => ({
      labels: categories.map((cat) => cat.title),
      datasets: [
        {
          data: categories.map((cat) => cat.totalCategoryExpenses || 0),
          backgroundColor: dynamicColors,
          borderWidth: 2,
          borderColor: "#0f172a",
        },
      ],
    }),
    [categories, dynamicColors],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label(context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage =
                total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            },
          },
        },
      },
    }),
    [],
  );

  const total = useMemo(
    () =>
      categories.reduce(
        (sum, cat) => sum + (cat.totalCategoryExpenses || 0),
        0,
      ),
    [categories],
  );

  const legendData = useMemo(
    () =>
      categories
        .map((cat, dataIndex) => ({
          dataIndex,
          title: cat.title,
          value: cat.totalCategoryExpenses || 0,
          percentage:
            total > 0
              ? (((cat.totalCategoryExpenses || 0) / total) * 100).toFixed(1)
              : 0,
          color: dynamicColors[dataIndex],
        }))
        .filter((item) => item.value > 0),
    [categories, dynamicColors, total],
  );

  const hasExpenses = useMemo(
    () =>
      categories.length > 0 &&
      categories.some((cat) => (cat.totalCategoryExpenses || 0) > 0),
    [categories],
  );

  const savedAmount = income - totalMonthlyExpenses;
  const savedAmountClass =
    savedAmount >= 0 ? "text-emerald-400" : "text-red-400";

  const toggleExpanded = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((v) => !v);
  }, []);

  const stopPropagation = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return {
    isExpanded,
    chartData,
    chartOptions,
    total,
    legendData,
    hasExpenses,
    savedAmount,
    savedAmountClass,
    toggleExpanded,
    stopPropagation,
  };
}
