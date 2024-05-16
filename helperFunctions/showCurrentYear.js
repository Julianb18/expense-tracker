export const showCurrentYear = (data) => {
  let year = {};
  if (data && data.years) {
    const currentYear = new Date().getFullYear();

    year = data.years.find((year) => year.year === currentYear);
  }
  return year;
};
