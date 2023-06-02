const { Builder, By, Key, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const colors = require("colors");
const login = require("./login.js");

async function clearForm(email, password, confirmPassword, internalNumber, course, year) {
	await Promise.all([
		email.clear(),
		password.clear(),
		confirmPassword.clear(),
		internalNumber.clear(),
		course.clear(),
		year.clear(),
	]);
}

module.exports = async (url) => {
	try {
		const driver = await new Builder().forBrowser("firefox").withCapabilities(new firefox.Options()).build();

		await driver.get(url);
		await login({ driver, email: "user@esmad.ipp.pt", password: "Esmad_2223" });

		//* Edit profile
		let email, password, confirmPassword, internalNumber, course, year;

		await driver.wait(until.elementLocated(By.className("edit-profile-btn"))).click();

		email = await driver.wait(until.elementLocated(By.css("input[type='email']")));
		password = await driver.wait(until.elementLocated(By.css("input[placeholder='Password']")));
		confirmPassword = await driver.wait(
			until.elementLocated(By.css("input[placeholder='Confirme Password']"))
		);
		internalNumber = await driver.wait(
			until.elementLocated(By.css("input[placeholder='Número Interno do Aluno (opcional)']"))
		);
		course = await driver.wait(until.elementLocated(By.css("input[placeholder='Curso (opcional)']")));
		year = await driver.wait(until.elementLocated(By.css("input[placeholder='Ano do Curso (opcional)']")));

		// clear the fields
		await clearForm(email, password, confirmPassword, internalNumber, course, year);

		// New data
		await Promise.all([
			email.sendKeys("user.updated@esmad.ipp.pt"),
			password.sendKeys("Esmad_2223"),
			confirmPassword.sendKeys("Esmad_2223"),
			internalNumber.sendKeys("123456789"),
			course.sendKeys("TSIW - Updated"),
			year.sendKeys("3"),
		]);

		// click on the save button
		await driver.wait(until.elementLocated(By.css("button[type='submit']"))).click();

		await driver.wait(until.elementLocated(By.className("text-success")));

		// close modal (click on button with class close)
		await driver.wait(until.elementLocated(By.className("close"))).click();

		//* Edit Profile to the original data
		await driver.wait(until.elementLocated(By.className("edit-profile-btn"))).click();

		email = await driver.wait(until.elementLocated(By.css("input[type='email']")));
		password = await driver.wait(until.elementLocated(By.css("input[placeholder='Password']")));
		confirmPassword = await driver.wait(
			until.elementLocated(By.css("input[placeholder='Confirme Password']"))
		);
		internalNumber = await driver.wait(
			until.elementLocated(By.css("input[placeholder='Número Interno do Aluno (opcional)']"))
		);
		course = await driver.wait(until.elementLocated(By.css("input[placeholder='Curso (opcional)']")));
		year = await driver.wait(until.elementLocated(By.css("input[placeholder='Ano do Curso (opcional)']")));

		// clear the fields
		await clearForm(email, password, confirmPassword, internalNumber, course, year);

		// New data
		await Promise.all([
			email.sendKeys("user@esmad.ipp.pt"),
			password.sendKeys("Esmad_2223"),
			confirmPassword.sendKeys("Esmad_2223"),
			internalNumber.sendKeys("40210462"),
			course.sendKeys("TSIW"),
			year.sendKeys("2"),
		]);

		await driver.wait(until.elementLocated(By.css("button[type='submit']"))).click();

		await driver.wait(until.elementLocated(By.className("text-success")));

		await driver.wait(until.elementLocated(By.className("close"))).click();

		console.log(colors.blue("Profile test passed!"));
		driver.quit();
	} catch (err) {
		console.log(err);
	}
};
