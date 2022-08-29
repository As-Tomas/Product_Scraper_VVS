const puppeteer = require('puppeteer');
const siteLink = require('./project-objectives');

console.log(siteLink);
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto(siteLink.objectLink);
    await page.screenshot({path: 'example.png'});

    await browser.close();
})();