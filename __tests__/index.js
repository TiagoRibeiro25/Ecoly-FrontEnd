const profileTest = require("./profile.test.js");
const registerTest = require("./register.test.js");
const mainPage = require("./mainPage.test.js");
const activitiesTest = require("./activities.test.js");

(async () => {
	const url = "https://ecoly.pages.dev/";

	await profileTest(url);
	await registerTest(url);
	await mainPage(url);
	await activitiesTest(url);
})();
