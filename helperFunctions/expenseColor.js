/**
 * Returns color based on spending percentage
 * @param {number} spentPercentage - Percentage of budget spent (0-100+)
 * @returns {string} Color code for the spending level
 */
export const expenseColor = (spentPercentage) => {
  const red = "#ee5552";
  const green = "rgb(34,197,94)";

  if (spentPercentage >= 100) {
    return red;
  } else {
    return green;
  }
};
