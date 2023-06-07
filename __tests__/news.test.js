const { Builder, until, By } = require('selenium-webdriver');
const firefox = require("selenium-webdriver/firefox");
const login = require("./login.js");
const colors = require('colors');

module.exports = async (url) =>{
    try {
        console.log(colors.blue("News page test running..."));

        const driver = await new Builder().forBrowser("firefox").withCapabilities(new firefox.Options()).build();
    
        await driver.get(url);


        const newsIcon = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/news-a3bbf527.svg"]')),
            5000
          );
          
          await driver.executeScript('arguments[0].click()', newsIcon);
          
  
  
          const image = await driver.wait(
            until.elementLocated(By.css('img[data-v-9fc72e25][src="../assets/icons/seeMore.svg"]')),
            5000
          );
      
          await driver.executeScript('arguments[0].scrollIntoView()', image);
          await image.click();
  
  
          const home = await driver.wait(
              until.elementLocated(By.css('img[src="/assets/logo_dark-772ab600.webp"]')),
              5000
          )
          
          await home.click();
  
  
          try {
            await login({ driver, email: "Admin@esmad.ipp.pt", password: "Esmad_2223" });
          } catch (error) {
            console.log(error);
          }
  
          const home2 = await driver.wait(
              until.elementLocated(By.css('img[src="/assets/logo_dark-772ab600.webp"]')),
              5000
          );
    
          await home2.click();
          
          const newsIcon2 = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/news-a3bbf527.svg"]')),
            5000
          );
          
          
          await driver.executeScript('arguments[0].click()', newsIcon2);
  
          const removeBtn = await driver.wait(
            until.elementLocated(By.css('img[data-v-00a57e29][src="../assets/icons/remove-light.svg"]')),
              5000
          )
  
          removeBtn.click();
              
          const removeWindowOff = await driver.wait(
            until.elementLocated(By.className('close')),
              5000
          )
  
          await removeWindowOff.click();
  
          const addNew = await driver.wait(
            until.elementLocated(By.className('px-3 w-100')),
              5000
          )
          
          await addNew.click();
          
  
          const newTitle = await driver.wait(
            until.elementLocated(By.className('form-control light-theme-input')),
              5000
          )
  
          await newTitle.sendKeys('Test new');
  
  
          const newBody = await driver.wait(
            until.elementLocated(By.className('form-control custom-scroll-bar light-theme-input custom-scroll-bar-light')),
              5000
          )
  
          await newBody.sendKeys('This is the body of the new post');
  
          const newsIcon3 = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/news-a3bbf527.svg"]')),
            5000
          );
          
          
          await driver.executeScript('arguments[0].click()', newsIcon3);
  
          const searchBar = await driver.wait(
            until.elementLocated(By.className('form-control searchbar-input bg-light')),
              5000
          )
  
          await searchBar.sendKeys('Descoberta de nova espécie animais em área selvagem chama a atenção da comunidade científica');
          console.log(colors.green("News page test passed!"));
    } catch (error) {
        console.log(colors.red("News page test failed!"));
        console.log(colors.yellow("Error: ") + error);
    }
}