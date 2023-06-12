const { Builder, until, By } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const colors = require('colors');

module.exports = async (url) => {
    try {
        console.log(colors.blue("Main page test running..."));

        const driver = await new Builder().forBrowser("firefox").withCapabilities(new firefox.Options()).build();

        await driver.get(url);

        const carousselArrowRight = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/rightDarkThemeArrow-a5c883fc.svg"]')),
            5000
        );
    
        await carousselArrowRight.click();
    
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
    
        const carousselArrowLeft = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/leftDarkThemeArrow-7becc0d9.svg"]')),
            5000
        );
    
        await carousselArrowLeft.click();

        const lightMode = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/dark-a1c90c7a.svg"]')),
            5000
        )

        await lightMode.click();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const darkMode = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/light-7ada35aa.svg"]')),
            5000
        )

        await darkMode.click();
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const article = await driver.wait(
            until.elementLocated(By.className("see-details-btn py-2 px-3 recent-new-btn-dark")),
            5000
          );
      
        await article.click();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const home = await driver.wait(
            until.elementLocated(By.css('img[src="/assets/logo-0133b710.webp"]')),
            5000
        )
        
        await home.click();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const activity = await driver.wait(
            until.elementLocated(By.className('see-more-btn py-1 px-3')),
            5000
          );
      
          // Click on the element using JavaScript
          await driver.executeScript('arguments[0].click()', activity);

          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          // Locate the "home" element again
            const home2 = await driver.wait(
                until.elementLocated(By.css('img[src="/assets/logo_exp-9d75d77e.webp"]')),
                5000
            );
  
            await home2.click();

            const Faq = await driver.wait(
                until.elementLocated(By.className('btn btn-info btn-block text-left question collapsed')),
                5000
            );
  
            await Faq.click();

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const FaqClosed = await driver.wait(
                until.elementLocated(By.className('btn btn-info btn-block text-left question not-collapsed')),
                5000
            );
  
            await FaqClosed.click();

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const newsFooter = await driver.wait(
                until.elementLocated(By.css('a[href="/news"]')),
                5000
              );
                
            await newsFooter.click();
              
            await new Promise((resolve) => setTimeout(resolve, 2000));
              
            const home3 = await driver.wait(
                until.elementLocated(By.css('img[src="/assets/logo_exp-9d75d77e.webp"]')),
                5000
            );
  
            await home3.click();
              
            await new Promise((resolve) => setTimeout(resolve, 2000));
              
              // Select the "atividades" link based on the href attribute
            const activitiesFooter = await driver.wait(
                until.elementLocated(By.css('a[href="/activities"]')),
                5000
              );
                
            await activitiesFooter.click();

            await new Promise((resolve) => setTimeout(resolve, 2000));
              
            const home4 = await driver.wait(
                until.elementLocated(By.css('img[src="/assets/logo_exp-9d75d77e.webp"]')),
                5000
            );
  
            await home4.click();
            
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const emailInput = await driver.wait(
                until.elementLocated(By.css('input[type="email"]')),
                5000
              );
              await emailInput.sendKeys('example@gmail.com');
              
              const subscribeButton = await driver.wait(
                until.elementLocated(By.id('button-addon2')),
                5000
              );
              await subscribeButton.click();
            
            console.log(colors.green("Main page test passed!"));
            await driver.quit();
    } catch (error) {
        console.log(colors.red("Main page test failed!"));
        console.log(colors.yellow("Error: ") + error);
    }
};
