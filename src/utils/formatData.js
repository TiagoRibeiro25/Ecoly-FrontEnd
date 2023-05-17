const UNIT_THRESHOLDS = [
	{ threshold: 1e12, unit: "T" },
	{ threshold: 1e9, unit: "B" },
	{ threshold: 1e6, unit: "M" },
	{ threshold: 1e3, unit: "K" },
];
/**
 *
 * @param {number} number - Number to be formatted
 * @param {number} decimalPlaces - Number of decimal places
 * @returns {string} - Formatted number
 */
export function formatNumber(number, decimalPlaces = 1) {
	if (number < 0) return `-${formatNumber(-number, decimalPlaces)}`;
	for (const { threshold, unit } of UNIT_THRESHOLDS) {
		if (number >= threshold) {
			const formattedNumber = (number / threshold).toFixed(decimalPlaces);
			return `${formattedNumber}${unit}`;
		}
	}
	return number.toString();
}

/**
 *
 * @param {string} text - Text to be formatted
 * @param {Number} maxLength - Max length of the text
 * @returns {string} - Formatted text
 */
export function formatText(text, maxLength = 20) {
	return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

/**
 * @param {string} date - Date to be formatted
 * @param {'yyyy-mm-dd' | 'dd-mm-yyyy'} dataType - Format type
 * @returns {string} - Formatted date
 */
export function formatDate(date, dataType) {
	if (dataType === "yyyy-mm-dd") {
		const [year, month, day] = date.split("-");
		return `${day}-${month}-${year}`;
	} else if (dataType === "dd-mm-yyyy") {
		const [day, month, year] = date.split("-");
		return `${year}-${month}-${day}`;
	}

	return date;
}
