const parseToNum = (text) => {
  text = text.replace(".", "");
  text = text.replace(",", ".");
  return parseFloat(text);
};

const formatNumbers = (value) => {
  //format a number like j1>.2r03 to 12,03
  value = value + "";
  let digits = value.replace(/\D/g, "");
  let result = digits;
  if (digits.length > 2) {
    result = digits.slice(0, -2) + "," + digits.slice(-2);
  }
  if (digits.length > 5) {
    result =
      digits.slice(0, -5) + "." + digits.slice(-5, -2) + "," + digits.slice(-2);
  }
  if (digits.length > 8) {
    result =
      digits.slice(0, -8) +
      "." +
      digits.slice(-8, -5) +
      "." +
      digits.slice(-5, -2) +
      "," +
      digits.slice(-2);
  }
  return result;
};

module.exports = { parseToNum, formatNumbers };
