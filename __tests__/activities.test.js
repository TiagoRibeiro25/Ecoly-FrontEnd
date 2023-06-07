const { Builder, Capabilities, until, By, Key } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const colors = require("colors");
const login = require("./login.js");

module.exports = async (url) => {
	try {
		console.log(colors.blue("Activities test running..."));

		const driver = await new Builder().forBrowser("firefox").withCapabilities(new firefox.Options()).build();

		await driver.get(url);

		await driver.sleep(1300);

		await login({ driver, email: "user@esmad.ipp.pt", password: "Esmad_2223" });

		// --------------------------------------------------ACTIVITIES PART-------------------------------------------------------------
		// click one activities icon on the sidebar menu to acess the activities page
		const activitiesIcon = await driver.wait(until.elementLocated(By.css("a[href='/activities']")));
		await activitiesIcon.click();

		await driver.sleep(800);

		// // to click outside to close the sidebar menu
		const outside = await driver.wait(until.elementLocated(By.className("title text-left mt-3")));
		await outside.click();

		await driver.sleep(800);

		// --------------------------------------------------ACTIVITIES PAGE PART-------------------------------------------------------------
		// // search an acitivity on the search bar
		const search = await driver.wait(until.elementLocated(By.className("form-control searchbar-input")));
		await search.sendKeys("jardim");

		await driver.sleep(3000);

		// // clean the characters on the search bar
		const searchValue = await search.getAttribute("value");
		for (let i = 0; i < searchValue.length; i++) {
			await search.sendKeys(Key.BACK_SPACE);
			await driver.sleep(200); // Add a small delay for a smooth effect
		}
		await driver.sleep(2000);

		await search.sendKeys("jardim");
		await driver.sleep(2500);

		// click in one activity to acess the activity page througth the search bar
		const searchDetailActivity = await driver.wait(until.elementLocated(By.css("a[href='/activities/3']")));
		await searchDetailActivity.click();

		await driver.sleep(1000);

		// --------------------------------------------------ACTIVITY PAGE PART SCROLL TEST-------------------------------------------------------------
		// Set the scroll behavior to smooth for the document element
		await driver.executeScript("document.documentElement.style.scrollBehavior = 'smooth';");

		// Get the document height
		const documentHeight = await driver.executeScript(
			"return Math.max(" +
				"document.body.scrollHeight, document.body.offsetHeight, " +
				"document.documentElement.clientHeight, document.documentElement.scrollHeight, " +
				"document.documentElement.offsetHeight);"
		);

		// Calculate the duration based on the desired speed
		const speed = 2000;
		const windowHeight = await driver.executeScript(
			"return window.innerHeight || document.documentElement.clientHeight;"
		);
		const duration = (Math.abs(documentHeight - windowHeight) / speed) * 1000;

		// Function to perform smooth scrolling with delay
		const smoothScrollWithDelay = async (scrollPosition) => {
			// Scroll to the specified position
			await driver.executeScript(`window.scrollTo(0, ${scrollPosition});`);

			// Pause for the specified delay duration
			const delayDuration = 300;
			await driver.sleep(delayDuration);
		};

		// Perform smooth scrolling with delay
		const scrollStep = 100;
		for (
			let scrollPosition = 0;
			scrollPosition <= documentHeight - windowHeight;
			scrollPosition += scrollStep
		) {
			await smoothScrollWithDelay(scrollPosition);
		}

		await driver.sleep(1300);

		await driver.navigate().back();

		await driver.sleep(2000);

		// --------------------------------------------------ACTIVITIES PAGE PART-------------------------------------------------------------
		// --------------------------------------------------acessing the detail activity throught the image-------------------------------------------------------------
		// Find the link element with href="/activities/3"
		const linkDetailActivity = await driver.wait(until.elementLocated(By.css("a[href='/activities/3']")));

		// Find the image element within the link
		const imageDetailActivity = await linkDetailActivity.findElement(By.css(".img-fluid.overlay-image"));

		// Execute JavaScript to change the opacity
		await driver.executeScript("arguments[0].style.opacity = '1'", imageDetailActivity);

		await driver.sleep(2500);

		// Click on the image element using JavaScript's click() method
		await driver.executeScript("arguments[0].click()", imageDetailActivity);

		await driver.sleep(2300);

		await driver.navigate().back();

		await driver.sleep(1000);
		// --------------------------------------------------acessing the detail activity throught the title-------------------------------------------------------------
		const titleDetailActivity = await driver.wait(
			until.elementLocated(
				By.xpath(
					"//a[@href='/activities/3' and contains(@class, 'activity-title') and contains(@class, 'title-dark')]"
				)
			)
		);

		// Hover over the element
		await driver.actions().move({ origin: titleDetailActivity }).perform();

		// Wait for a short delay
		await driver.sleep(1500);

		// Click on the element
		await titleDetailActivity.click();

		await driver.sleep(1300);

		await driver.navigate().back();

		await driver.findElement(By.className("title text-left mt-3")).click();

		//----------------------------------------------ADD ACTIVITY TEST-------------------------------------------------------------
		// TESTING ALL THE REQUIRED--------------------------
		const addActivityFormButton = await driver.wait(
			until.elementLocated(By.css("a[href='/activities/create']"))
		);

		// hover over the element
		await driver.actions().move({ origin: addActivityFormButton }).perform();

		// Wait for a short delay
		await driver.sleep(1300);

		// Click on the element
		await addActivityFormButton.click();

		await driver.sleep(1200);

		// add image button
		const addImageButton = await driver.wait(until.elementLocated(By.css(".add-new-img")));

		await driver.sleep(500);

		// hover over the element
		await driver.actions().move({ origin: addImageButton }).perform();

		await driver.sleep(500);

		await driver.findElement(By.className("title text-left mt-3")).click();

		const titleInput = await driver.wait(until.elementLocated(By.css('textarea[placeholder="Título"]')));
		await titleInput.sendKeys("Teste");

		await driver.sleep(500);

		const diagnosticInput = await driver.wait(
			until.elementLocated(By.css('textarea[placeholder="Diagnóstico"]'))
		);
		await diagnosticInput.sendKeys("Teste");

		await driver.sleep(500);

		const objectiveInput = await driver.wait(
			until.elementLocated(By.css('textarea[placeholder="Objetivo"]'))
		);
		await objectiveInput.sendKeys("Teste");

		await driver.sleep(500);

		const participantsInput = await driver.wait(
			until.elementLocated(By.css('textarea[placeholder="Participantes"]'))
		);
		await participantsInput.sendKeys("Teste");

		await driver.sleep(500);

		const metaInput = await driver.wait(until.elementLocated(By.css('textarea[placeholder="Metas"]')));
		await metaInput.sendKeys("Teste");

		await driver.sleep(500);

		const indicator_evaluation_Input = await driver.wait(
			until.elementLocated(By.css('textarea[placeholder="Indicadores de avaliação"]'))
		);
		await indicator_evaluation_Input.sendKeys("Teste");

		await driver.sleep(500);

		const resourcesInput = await driver.wait(
			until.elementLocated(By.css('textarea[placeholder="Recursos"]'))
		);
		await resourcesInput.sendKeys("Teste");

		await driver.sleep(500);

		const indicator_instruments_evaluation_Input = await driver.wait(
			until.elementLocated(By.css('textarea[placeholder="Instrumentos de avaliação"]'))
		);
		await indicator_instruments_evaluation_Input.sendKeys("Teste");

		// scroll into view to the class .mr-1.info-label.info
		await driver.executeScript(
			"arguments[0].scrollIntoView(true);",
			await driver.findElement(By.css(".mr-1.info-label"))
		);

		await driver.sleep(800);

		await driver.findElement(By.css(".mr-1.info-label")).click();

		await driver.sleep(500);

		// // Find all star rating elements
		const starRatingElements = await driver.findElements(By.css(".b-icon.bi.bi-star"));

		// // Loop over each element, and click each one in turn
		for (let starRatingElement of starRatingElements) {
			await driver.sleep(200);
			// hoover
			await driver.actions().move({ origin: starRatingElement }).perform();
			await driver.sleep(200);
		}

		await driver.sleep(300);

		await driver.findElement(By.css(".mr-1.info-label")).click();

		await driver.sleep(300);

		await starRatingElements[4].click();

		await driver.sleep(300);

		await driver.findElement(By.css(".mr-1.info-label")).click();

		await driver.sleep(300);

		const selectElement = await driver.findElement(By.css(".custom-select.theme-picker.my-3.theme-picker"));
		await driver.sleep(300);

		await selectElement.click();

		await driver.sleep(1400);

		await driver
			.findElement(By.css(".custom-select.theme-picker.my-3.theme-picker > option:nth-child(2)"))
			.click();

		await driver.sleep(300);

		// label for the initial date
		const initialDate = await driver.wait(
			until.elementLocated(By.xpath("//label[contains(text(), 'Data de início')]"))
		);

		await initialDate.click();

		await driver.sleep(800);

		// IF YOU ARE RUNNING THIS TEST IN THE END OF THE MONTH, CHANGE THE NUMBER 28 TO 1
		const initialDateDay = await driver.wait(
			until.elementLocated(
				By.xpath(
					"//span[contains(@class, 'btn border-0 rounded-circle text-nowrap btn-outline-light text-dark font-weight-bold') and contains(text(), '28')]"
				)
			)
		);

		await driver.sleep(800);

		await initialDateDay.click();

		// label for the initial date
		const finalDate = await driver.wait(
			until.elementLocated(By.xpath("//label[contains(text(), 'Data de término')]"))
		);

		await finalDate.click();

		await driver.sleep(800);

		const finalDateDay = await driver.wait(
			until.elementLocated(
				By.xpath(
					"//span[contains(@class, 'btn border-0 rounded-circle text-nowrap btn-outline-light text-dark font-weight-bold') and contains(text(), '29')]"
				)
			)
		);

		await driver.sleep(800);

		await finalDateDay.click();

		await driver.sleep(500);

		await driver.navigate().back();

		// ---------------------------------------------------------------------------TEST SCHOOLS FILTER ON ACTIVITIES PAGE--------------------------------------------------------------------------------

		// selecting an school without activities--------------------------------------------------------------
		const selectSchoolNoActivities = await driver.findElement(
			By.css(".custom-select.mt-3.school-select.school-dark-mode")
		);
		await driver.sleep(800);

		await selectSchoolNoActivities.click();

		await driver.sleep(1400);

		selectSchoolNoActivities
			.findElement(By.css(".custom-select.mt-3.school-select.school-dark-mode > option:nth-child(2)"))
			.click();

		await driver.sleep(300);

		// selecting an school with activities--------------------------------------------------------------
		const selectSchoolActivities = await driver.findElement(
			By.css(".custom-select.mt-3.school-select.school-dark-mode")
		);
		await driver.sleep(800);

		await selectSchoolActivities.click();

		await driver.sleep(1400);

		selectSchoolActivities
			.findElement(By.css(".custom-select.mt-3.school-select.school-dark-mode > option:nth-child(3)"))
			.click();

		//selecting all schools--------------------------------------------------------------
		const selectAllSchools = await driver.findElement(
			By.css(".custom-select.mt-3.school-select.school-dark-mode")
		);

		await driver.sleep(800);

		await selectAllSchools.click();

		await driver.sleep(1400);

		selectAllSchools
			.findElement(By.css(".custom-select.mt-3.school-select.school-dark-mode > option:nth-child(1)"))
			.click();

		await driver.sleep(300);

		// ---------------------------------------------------------------------------TESTING THE FINISHING ACTIVITY REPORT MODAL--------------------------------------------------------------------------------
		// select the finish button with input type button and with the class finish-btn btn btn-sm rounded-pill px-3 float-right mt-2 finish-btn-dark-mode
		const finishButton = await driver.wait(until.elementLocated(By.css(".finish-btn")));

		await driver.sleep(1000);

		// Hover over the button
		await driver.actions().move({ origin: finishButton }).perform();

		await driver.sleep(1300);

		await finishButton.click();

		// // add image report button
		const addImageReportButton = await driver.wait(until.elementLocated(By.css(".add-new-img")));

		await driver.sleep(500);

		await driver.actions().move({ origin: addImageReportButton }).perform();

		await driver.sleep(800);

		// click on the class col-12 d-flex justify-content-center align-items-center px-0
		await driver
			.findElement(By.css('textarea[placeholder="Relatório da atividade (mínimo 100 caracteres)"]'))
			.click();

		const reportInput = await driver.wait(
			until.elementLocated(By.css('textarea[placeholder="Relatório da atividade (mínimo 100 caracteres)"]'))
		);

		await driver.sleep(700);

		await reportInput.sendKeys("Finalizado com sucesso!");

		await driver.sleep(1300);

		const closeModal = await driver.wait(until.elementLocated(By.css(".close")));
		await closeModal.click();

		// ---------------------------------------------------------------------------TESTING DELETING AN ACTIVITY--------------------------------------------------------------------------------
		await driver.sleep(800);
		// // select the class btn btn-secondary btn-sm rounded-circle bg-transparent border-0
		// const deleteActivityButton = await driver.wait(
		// 	until.elementLocated(By.css(".btn.btn-secondary.btn-sm.rounded-circle.bg-transparent.border-0"))
		// );

		// await driver.sleep(800);

		// await deleteActivityButton.click();

		// await driver.sleep(1300);

		// // select the button containting this class btn btn-secondary btn btn-block modal-remove-btn w-50 mx-auto mt-4
		// const confirmDeleteActivityButton = await driver.wait(
		// 	until.elementLocated(By.css(".btn.btn-secondary.btn.btn-block.modal-remove-btn.w-50.mx-auto.mt-4"))
		// );

		// await driver.sleep(1500);

		// await confirmDeleteActivityButton.click();

		await driver.sleep(2000);

		console.log(colors.green("Activities test passed!"));

		driver.quit();
	} catch (err) {
		console.log(colors.red("Activities test failed!"));
		console.log(colors.yellow(`error: ${err.message}`));
	}
};
