/**
 * Finds the current year's data from user data
 * @param {Object} data - User data object containing years array
 * @returns {Object} Current year data or empty object if not found
 */
export const showCurrentYear = (data) => {
  if (data && data.years) {
    const currentYear = new Date().getFullYear();
    return data.years.find((year) => year.year === currentYear) || {};
  }
  return {};
};
