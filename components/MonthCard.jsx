import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ChevronDown } from "./svg/ChevronDown";
import {
  generateChartColors,
  ensureContrast,
} from "../helperFunctions/chartColors";
import { formatCurrency } from "../helperFunctions/currencyFormatter";

ChartJS.register(ArcElement, Tooltip, Legend);

export const MonthCard = ({
  month,
  income,
  totalMonthlyExpenses,
  customCss,
  categories = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dynamicColors = ensureContrast(generateChartColors(categories.length));

  const chartData = {
    labels: categories.map((cat) => cat.title),
    datasets: [
      {
        data: categories.map((cat) => cat.totalCategoryExpenses || 0),
        backgroundColor: dynamicColors,
        borderWidth: 2,
        borderColor: "#0f172a",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
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
  };

  const total = categories.reduce(
    (sum, cat) => sum + (cat.totalCategoryExpenses || 0),
    0,
  );

  const legendData = categories
    .map((cat, index) => ({
      title: cat.title,
      value: cat.totalCategoryExpenses || 0,
      percentage:
        total > 0
          ? (((cat.totalCategoryExpenses || 0) / total) * 100).toFixed(1)
          : 0,
      color: dynamicColors[index],
    }))
    .filter((item) => item.value > 0);

  const hasExpenses =
    categories.length > 0 &&
    categories.some((cat) => (cat.totalCategoryExpenses || 0) > 0);

  const savedAmount = income - totalMonthlyExpenses;
  const savedAmountClass =
    savedAmount >= 0 ? "text-emerald-400" : "text-red-400";

  return (
    <div
      className={`mb-6 w-full max-w-[550px] rounded-2xl border border-slate-700 bg-slate-800/90 shadow-2xl shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:shadow-black/30 sm:w-[350px] md:mb-0 md:w-[450px] ${customCss}`}
    >
      <div className="rounded-t-2xl border-b border-slate-700 bg-slate-900/80 py-3 text-center">
        <h2 className="font-semibold text-white">{month}</h2>
      </div>

      <div
        className={`flex flex-col bg-slate-800/95 px-4 py-4 ${
          isExpanded ? "rounded-none" : "rounded-b-2xl"
        }`}
      >
        <div className="flex w-full flex-col space-y-2">
          <div className="flex justify-between text-slate-300">
            <span>Income:</span>
            <span className="font-medium text-white">
              {formatCurrency(income)}
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Expense:</span>
            <span className="font-medium text-white">
              {formatCurrency(totalMonthlyExpenses)}
            </span>
          </div>

          <div className="mt-3 flex justify-between text-slate-300">
            <span>Saved:</span>
            <span className={`font-semibold ${savedAmountClass}`}>
              {formatCurrency(savedAmount)}
            </span>
          </div>

          {hasExpenses && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-4 flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/40 p-2 text-sm text-slate-400 transition hover:border-slate-600 hover:text-white"
            >
              <span className="mr-2">
                {isExpanded ? "Hide" : "Show"} Category Breakdown
              </span>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {isExpanded && hasExpenses && (
        <div
          className="rounded-b-2xl border-t border-slate-700 bg-slate-900/70 px-4 pb-4 pt-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <h3 className="mb-4 text-center text-lg font-semibold text-white">
            Spending by Category
          </h3>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex h-56 w-full flex-shrink-0 justify-center lg:w-56">
              <div className="relative w-full max-w-xs lg:w-56 lg:max-w-none">
                <Doughnut data={chartData} options={chartOptions} />

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-sm text-slate-400">Total</div>
                  <div className="text-lg font-semibold text-white">
                    {formatCurrency(total)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 lg:ml-6">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {legendData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/80 p-3 transition hover:border-slate-600 hover:bg-slate-800"
                  >
                    <div className="flex min-w-0 flex-1 items-center">
                      <div
                        className="mr-3 h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-sm text-slate-200">
                        {item.title}
                      </span>
                    </div>

                    <div className="ml-2 flex items-center text-right">
                      <span className="mr-2 text-sm font-medium text-white">
                        {formatCurrency(item.value)}
                      </span>
                      <span className="w-10 text-xs text-slate-400">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-slate-700 pt-3">
                <div className="text-center text-xs text-slate-400 lg:text-left">
                  {legendData.length} categories • Total:{" "}
                  {formatCurrency(total)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
