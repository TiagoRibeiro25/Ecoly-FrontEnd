const profileTest = require("./profile.test.js");
const registerTest = require("./register.test.js");
const mainPage = require("./mainPage.test.js");
const activitiesTest = require("./activities.test.js");
const newsTest = require("./news.test.js");
const adminPage = require("./adminPage.test.js");

(async () => {
	const url = "https://ecoly.pages.dev/";

	// await profileTest(url);
	// await registerTest(url);
	// await mainPage(url);
	// await activitiesTest(url);
	// await newsTest(url);
	await adminPage(url);
})();
