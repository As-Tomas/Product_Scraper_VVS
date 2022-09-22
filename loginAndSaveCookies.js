const { ConsoleMessage } = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());
const siteLink = require("./project-objectives");
const fs = require('fs');
const jsonfile = require('jsonfile')

async function scrapeProductPage(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
    );
    await page.setViewport({ width: 1030, height: 768 });

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(2000);

    const firstLoginBTN = (await page.$x('//*[@id="container"]/div/div/header/div/div/div[1]/div/div/div/span'))[0]
    firstLoginBTN.click();

    await page.waitForTimeout(2450);

    const secondLoginBTN = (await page.$x('//*[@id="container"]/div/div/div[4]/div[1]/div[2]/div/div/div/div/div/div[2]/button/span'))[0]
    secondLoginBTN.click();

    await page.waitForTimeout(3000);
    //const userNameField = (await page.$x('//*[@id="idp-discovery-username"]'))[0]
    await page.type('#idp-discovery-username', siteLink.email);

    await page.waitForTimeout(3200);

    await page.click('#idp-discovery-submit');

    await page.waitForTimeout(5000);
    //---type password
    //---from here take it manualy

    //await page.click('.button button-primary');

    await page.waitForTimeout(5201);
    // To Save the Session Cookies in puppeteer.

    const cookiesObject = await page.cookies()
    // Write cookies to temp file to be used in other profile pages
    jsonfile.writeFile('tmp/cookies.json', cookiesObject, { spaces: 2 },
        function (err) {
            if (err) {
                console.log('The file could not be written.', err)
            }
            console.log('Session has been successfully saved')
        });

    await browser.close();

}


scrapeProductPage(siteLink.homepage);