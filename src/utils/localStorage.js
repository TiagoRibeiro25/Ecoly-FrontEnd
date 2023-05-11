const PRE_KEY = "ecoly_";

export const getLocalStorage = (key) => {
	const finalKey = PRE_KEY + key;
	return localStorage[finalKey] ? localStorage[finalKey] : null;
};

export const setLocalStorage = (key, value) => {
	const finalKey = PRE_KEY + key;
	localStorage[finalKey] = value;
};

export const removeLocalStorage = (key) => {
	const finalKey = PRE_KEY + key;
	localStorage.removeItem(finalKey);
};
