const profile = require("./profile.test.js");

(async () => {
	const url = "https://ecoly.pages.dev/";

	await profile(url);
})();
