const UNIT_THRESHOLDS = [
	{ threshold: 1e12, unit: "T" },
	{ threshold: 1e9, unit: "B" },
	{ threshold: 1e6, unit: "M" },
	{ threshold: 1e3, unit: "K" },
];

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

export function formatText(text, maxLength = 20) {
	return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
