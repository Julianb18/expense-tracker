/**
 * Returns color based on spending percentage
 * @param {number} spentPercentage - Percentage of budget spent (0-100+)
 * @returns {string} Color code for the spending level
 */
export const expenseColor = (spentPercentage) => {
  const red = "#f87171";
  const green = "#4ade80";

  if (spentPercentage >= 100) {
    return red;
  } else {
    return green;
  }
};
