const { Builder, until, By} = require('selenium-webdriver');
const firefox = require("selenium-webdriver/firefox");
const login = require("./login.js");
const colors = require('colors');

module.exports = async (url) =>{
    try {
        console.log(colors.blue("Admin page test running..."));

        const driver = await new Builder().forBrowser("firefox").withCapabilities(new firefox.Options()).build();
    
        await driver.get(url);

        try {
            await login({ driver, email: "Admin@esmad.ipp.pt", password: "Esmad_2223" });
          } catch (error) {
            console.log(error);
          }
        
        const adminPage = await driver.wait(
            until.elementLocated(By.css('img[data-v-e7eba18d][src="/assets/admin-eb08d1bf.svg"]'))
        )
        
        await adminPage.click();

        const filter = await driver.wait(
            until.elementLocated(By.className('btn btn-dark dropdown-toggle'))
        )

        await filter.click();

        const adminOption = await driver.wait(
            until.elementLocated(By.xpath('//li/a[text()="admin"]'))
        );

        await adminOption.click();
        
        await driver.sleep(1000)

        const cargosButton = await driver.wait(
            until.elementLocated(By.id('cargos')), 5000
        )

        await cargosButton.click();  


        

          console.log(colors.green("Admin page test passed!"));
    } catch (error) {
        console.log(colors.red("Admin page test failed!"));
        console.log(colors.yellow("Error: ") + error);
    }
}