const numberRound = (number) => {
  try {
    const numericVal = parseInt(Number(number), 10);
    if (isNaN(numericVal)) {
      return 0;
    }

    return numericVal;
  } catch (err) {
    console.log(err)
    return 0
  }
}

const currencyFormat = (money, currency = 'DH') => {
  if (money === null || money === undefined || isNaN(money)) return `0.00 ${currency}`;

  const formattedMoney = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(money);

  return `${formattedMoney} ${currency}`;
};

/**
 * Transforms "2627" to "2026 / 2027"
 * @param {string|number} yearCode
 * @param {string} separator
 * @returns {string}
 */
const schoolYearFormat = (yearCode, separator = ' / ') => {
  if (!yearCode || String(yearCode).length !== 4) return yearCode;

  const codeStr = String(yearCode);
  const start = codeStr.substring(0, 2);
  const end = codeStr.substring(2, 4);

  return `20${start}${separator}20${end}`;
};

const dateFormat = (dateInput, showTime = false) => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Date invalide";

  // Date parts
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let formattedDate = `${day}-${month}-${year}`;

  // Time parts (if requested)
  if (showTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    formattedDate += ` ${hours}:${minutes}`;
  }

  return formattedDate;
};

const getSchoolYearFromDate = (dateString) => {
  if (!dateString) return "2627"; // Default fallback
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth is 0-indexed

  // Logic: If month is Sept (9) or later, it belongs to the year starting now
  // Example: Oct 2025 -> "2526" | Jan 2026 -> "2526"
  if (month >= 9) {
    const start = String(year).slice(-2);
    const end = String(year + 1).slice(-2);
    return `${start}${end}`;
  } else {
    const start = String(year - 1).slice(-2);
    const end = String(year).slice(-2);
    return `${start}${end}`;
  }
};

export {
  numberRound,
  currencyFormat,
  dateFormat,
  schoolYearFormat,
  getSchoolYearFromDate
}