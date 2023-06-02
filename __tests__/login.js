const { By, until } = require("selenium-webdriver");

module.exports = async ({ driver, email, password }) => {
	await driver.wait(until.elementLocated(By.css("a[href='/authenticate']"))).click();

	const loginEmail = await driver.wait(until.elementLocated(By.css("input[type='email']")));
	const loginPassword = await driver.wait(until.elementLocated(By.css("input[type='password']")));

	await loginEmail.sendKeys(email);
	await loginPassword.sendKeys(password);

	// click on the login button
	await driver.wait(until.elementLocated(By.css("button[type='submit']"))).click();
};
