const profileTest = require("./profile.test.js");
const registerTest = require("./register.test.js");

(async () => {
	const url = "https://ecoly.pages.dev/";

	await profileTest(url);
	await registerTest(url);
})();
