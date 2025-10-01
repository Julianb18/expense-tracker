import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChevronDown } from "./svg/ChevronDown";
import { generateChartColors, ensureContrast } from "../helperFunctions/chartColors";
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

  // Generate dynamic colors based on the number of categories
  const dynamicColors = ensureContrast(generateChartColors(categories.length));

  // Prepare chart data
  const chartData = {
    labels: categories.map(cat => cat.title),
    datasets: [
      {
        data: categories.map(cat => cat.totalCategoryExpenses || 0),
        backgroundColor: dynamicColors,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%', // Creates the donut hole
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Calculate percentages for custom legend
  const total = categories.reduce((sum, cat) => sum + (cat.totalCategoryExpenses || 0), 0);
  const legendData = categories.map((cat, index) => ({
    title: cat.title,
    value: cat.totalCategoryExpenses || 0,
    percentage: total > 0 ? ((cat.totalCategoryExpenses || 0) / total * 100).toFixed(1) : 0,
    color: dynamicColors[index]
  })).filter(item => item.value > 0); // Only show categories with expenses

  const hasExpenses = categories.length > 0 && categories.some(cat => (cat.totalCategoryExpenses || 0) > 0);

  return (
    <div
      className={`w-full max-w-[550px] sm:w-[350px] md:w-[450px] rounded-2xl shadow-2xl shadow-gray-900/10 border border-gray-700 mb-6 md:mb-0 hover:shadow-3xl hover:shadow-gray-900/20 transition-all duration-300 ${customCss}`}
    >
      <div className="text-center py-3 bg-primaryDark rounded-t-2xl">
        <h2 className="text-white">{month}</h2>
      </div>
      <div className={`flex flex-col bg-white ${isExpanded ? 'rounded-none' : 'rounded-b-2xl'} px-4 py-4`}>
        <div className="flex flex-col w-full">
          <div className="flex justify-between">
            Income: <span>{formatCurrency(income)}</span>
          </div>
          <div className="flex justify-between">
            Expense: <span>{formatCurrency(totalMonthlyExpenses)}</span>
          </div>
          <div className="flex justify-between mt-3">
            Saved: <span>{formatCurrency(income - totalMonthlyExpenses)}</span>
          </div>
          
          {hasExpenses && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex items-center justify-center mt-4 p-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="mr-2">
                {isExpanded ? 'Hide' : 'Show'} Category Breakdown
              </span>
              <ChevronDown 
                className={`h-4 w-4 transform transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Chart Section */}
      {isExpanded && hasExpenses && (
        <div 
          className="bg-white rounded-b-2xl px-4 pb-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="border-t pt-4">
            <h3 className="text-center text-lg font-semibold mb-4 text-gray-700">
              Spending by Category
            </h3>
            
            {/* Responsive Chart Layout */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Chart Container */}
              <div className="flex-shrink-0 h-56 w-full lg:w-56 flex justify-center">
                <div className="relative w-full max-w-xs lg:max-w-none lg:w-56">
                  <Doughnut data={chartData} options={chartOptions} />
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-lg font-semibold text-gray-700">{formatCurrency(total)}</div>
                  </div>
                </div>
              </div>
              
              {/* Custom Legend */}
              <div className="flex-1 lg:ml-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {legendData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border border-gray-200 transition-all duration-200">
                      <div className="flex items-center flex-1 min-w-0">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0 mr-3"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-700 truncate">{item.title}</span>
                      </div>
                      <div className="flex items-center ml-2 text-right">
                        <span className="text-sm font-medium text-gray-900 mr-2">{formatCurrency(item.value)}</span>
                        <span className="text-xs text-gray-500 w-10">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary Stats */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500 text-center lg:text-left">
                    {legendData.length} categories • Total: {formatCurrency(total)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
