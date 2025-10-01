/**
 * Formats a number as currency with decimal places only when needed
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency symbol (default: '€')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = '€') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0`;
  }
  
  const numericAmount = Number(amount);
  
  if (numericAmount % 1 === 0) {
    return `${currency}${numericAmount.toFixed(0)}`;
  } else {
    return `${currency}${numericAmount.toFixed(2)}`;
  }
};

/**
 * Formats a number with decimal places only when needed (no currency symbol)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted number string
 */
export const formatAmount = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  
  const numericAmount = Number(amount);
  
  if (numericAmount % 1 === 0) {
    return numericAmount.toFixed(0);
  } else {
    return numericAmount.toFixed(2);
  }
};

/**
 * Parses a string or number to a float with proper decimal handling
 * @param {string|number} value - The value to parse
 * @returns {number} Parsed float value
 */
export const parseAmount = (value) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};
