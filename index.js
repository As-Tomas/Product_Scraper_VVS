// const puppeteer = require('puppeteer');
// const siteLink = require('./project-objectives');

// console.log(siteLink);
// (async () => {
//     const browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport:false,
//         userDataDir: "./tmp"
//     });
//     const page = await browser.newPage();
//     await page.goto(siteLink.objectLink);
//     await page.screenshot({path: 'example.png'});

//     await browser.close();
// })();

const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());
const siteLink = require('./project-objectives');

async function scrapeTorget(siteLink) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

    const allAdds = [];
}