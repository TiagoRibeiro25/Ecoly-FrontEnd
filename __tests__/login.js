const { By, until } = require("selenium-webdriver");
const colors = require("colors");

module.exports = async ({ driver, email, password }) => {
	await driver.wait(until.elementLocated(By.css("a[href='/authenticate']"))).click();

	const loginEmail = await driver.wait(until.elementLocated(By.css("input[type='email']")));

	// clear the email field
	await loginEmail.clear();

	// re-locate the password field
	const loginPassword = await driver.wait(until.elementLocated(By.css("input[type='password']")));

	// clear the password field
	await loginPassword.clear();

	// re-locate the email field again
	const reLocatedEmail = await driver.wait(until.elementLocated(By.css("input[type='email']")));

	// re-locate the password field again
	const reLocatedPassword = await driver.wait(until.elementLocated(By.css("input[type='password']")));

	// enter email and password
	await Promise.all([reLocatedEmail.sendKeys(email), reLocatedPassword.sendKeys(password)]);

	// click on the login button
	await driver.wait(until.elementLocated(By.css("button[type='submit']"))).click();

	await driver.sleep(800);
};
