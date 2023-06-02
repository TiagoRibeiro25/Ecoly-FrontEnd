const { By, until } = require("selenium-webdriver");

module.exports = async (driver) => {
	await driver.wait(until.elementLocated(By.css("a[href='/authenticate']"))).click();

	const loginEmail = await driver.wait(until.elementLocated(By.css("input[type='email']")));
	const loginPassword = await driver.wait(until.elementLocated(By.css("input[type='password']")));

	// go to the loginEmail and write "user@esmad.ipp.pt"
	await loginEmail.sendKeys("user@esmad.ipp.pt");

	// go to the loginPassword and write "password"
	await loginPassword.sendKeys("Esmad_2223");

	// click on the login button
	await driver.wait(until.elementLocated(By.css("button[type='submit']"))).click();
};
