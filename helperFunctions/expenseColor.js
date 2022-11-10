export const expenseColor = (spentPercentage) => {
  let color = "";
  const red = "#ee5552";
  const green = "rgb(34,197,94)";
  // const orange = "rgb(251,146,60)";

  if (spentPercentage >= 100) {
    color = red;
  } else {
    color = green;
  }
  // else if (spentPercentage >= 85) {
  //   color = orange;
  // }
  return color;
};
