const { Builder, until, By } = require('selenium-webdriver');
const firefox = require("selenium-webdriver/firefox");
const login = require("./login.js");
const colors = require('colors');

module.exports = async (url) =>{
    try {
        console.log(colors.blue("Manage page test running..."));

        const driver = await new Builder().forBrowser("firefox").withCapabilities(new firefox.Options()).build();
    
        await driver.get(url);

        try {
            await login({ driver, email: "Admin@esmad.ipp.pt", password: "Esmad_2223" });
        } catch (error) {
            console.log(error);
        }

        const home = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/logo-0133b710.webp"]')),
            5000
        );

        await home.click();


        const management = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/manage-1314f008.svg"]')),
            5000
          );

        await management.click();

        const addActivityText = "Adicionar Atividade";
        const addNewsText = "Adicionar Notícia";
        const adminText = "Administrador";

        // ...

        const addActivity = await driver.wait(
        until.elementLocated(By.xpath(`//span[@data-v-6f72b842 and @class="px-3 w-100" and text()="${addActivityText}"]`)),
        5000
        );
        await driver.wait(until.elementIsVisible(addActivity));
        await driver.executeScript("arguments[0].click();", addActivity);

        const management2 = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/manage-1314f008.svg"]')),
            5000
          );

        await management2.click();

        const addNews = await driver.wait(
            until.elementLocated(By.xpath(`//span[@data-v-6f72b842 and @class="px-3 w-100" and text()="${addNewsText}"]`)),
            5000
        );
        await driver.wait(until.elementIsVisible(addNews));
        await driver.executeScript("arguments[0].click();", addNews);


        const management3 = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/manage-1314f008.svg"]')),
            5000
        );

        await management3.click();

        const admin = await driver.wait(
            until.elementLocated(By.xpath(`//span[@data-v-6f72b842 and @class="px-3 w-100" and text()="${adminText}"]`)),
            5000
        );
        await driver.wait(until.elementIsVisible(admin));
        await driver.executeScript("arguments[0].click();", admin);

        const management4 = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/manage-1314f008.svg"]')),
            5000
        );

        await management4.click();

        const addTheme = await driver.wait(
            until.elementLocated(By.className('btn theme-btn add-btn mx-2 my-2 py-1 add-btn-dark'))
        )

        await addTheme.click();

        const themeInput = await driver.wait(
            until.elementLocated(By.className('form-control light-theme-input'))
        )
        
        await themeInput.sendKeys("Test theme");
        

        const closeTheme = await driver.wait(
            until.elementLocated(By.className('close'))
        )

        await closeTheme.click();

        const contact = await driver.wait(
            until.elementLocated(By.css('textarea[data-v-5302e0d9][placeholder="Conteúdo da mensagem (mínimo 100 caracteres)"]')),
            5000
        );
        await driver.wait(until.elementIsVisible(contact));
        await contact.sendKeys("Hello, this is my message!");

        const meeting = await driver.wait(
            until.elementLocated(By.css('textarea[data-v-5302e0d9][placeholder="Descrição da reunião"]')),
            5000
        );
        await driver.wait(until.elementIsVisible(meeting));
        await meeting.sendKeys("This is the meeting description.");
          
        console.log(colors.green("Manage page test passed!"));
    } catch (error) {
        console.log(colors.red("Manage page test failed!"));
        console.log(colors.yellow("Error: ") + error);
    }
}