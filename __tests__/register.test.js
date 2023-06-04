const { Builder, By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const colors = require("colors");

module.exports = async (url) => {
	try {
		console.log(colors.blue("Register test running..."));

		const driver = await new Builder().forBrowser("firefox").withCapabilities(new firefox.Options()).build();

		await driver.get(url);

		await driver.wait(until.elementLocated(By.css("a[href='/authenticate']"))).click();

		await driver.wait(until.elementLocated(By.css("span.change-form"))).click();

		await driver.wait(until.elementLocated(By.css("h1")));

		const username = await driver.wait(until.elementLocated(By.css("input[placeholder='Nome']")));
		const email = await driver.wait(until.elementLocated(By.css("input[placeholder='Email']")));
		const password = await driver.wait(until.elementLocated(By.css("input[placeholder='Password']")));
		const school = await driver.wait(until.elementLocated(By.css("select.custom-select")));
		const internalNumber = await driver.wait(
			until.elementLocated(By.css("input[placeholder='Número Interno do Aluno (opcional)']"))
		);
		const course = await driver.wait(until.elementLocated(By.css("input[placeholder='Curso (opcional)']")));
		const year = await driver.wait(
			until.elementLocated(By.css("input[placeholder='Ano do Curso (opcional)']"))
		);

		// generate unique random email
		const randomEmail = Math.random().toString(36).substring(2, 15) + "@esmad.ipp.pt";

		await Promise.all([
			username.sendKeys("Utilizador Teste"),
			email.sendKeys(randomEmail),
			password.sendKeys("Esmad_2223"),
			school.findElement(By.css("option:nth-child(1)")).click(),
			internalNumber.sendKeys("123456789"),
			course.sendKeys("TSIW"),
			year.sendKeys("3"),
		]);

		await driver.wait(until.elementLocated(By.css("button[type='submit']"))).click();

		await driver.wait(until.elementLocated(By.css("span.success-msg")));

		console.log(colors.green("Register test passed!"));
		await driver.quit();
	} catch (err) {
		console.log(colors.red("Register test failed!"));
		console.log(colors.yellow("Error: ") + err);
	}
};
