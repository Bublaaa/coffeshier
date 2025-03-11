export const formatNumber = (inputValue) => {
  // Remove non-numeric characters (except decimals)
  const numericValue = inputValue.replace(/[^\d]/g, "");

  // Convert to a number
  const number = Number(numericValue);

  // Format using Intl.NumberFormat (Indonesian format)
  return new Intl.NumberFormat("id-ID").format(number);
};
