const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());
const siteLink = require('./project-objectives');

async function scrapeProductPage(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

    const allAdds = [];

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(1000);

    const [el] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/h2');
    const text = await el.getProperty('textContent');
    const productName = await text.jsonValue();

    const [el2] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div/div[1]/div/img');
    const src = await el2.getProperty('src');
    const picture1 = await src.jsonValue();
    
    const images = await page.$$eval("img", (imgs) => {
        return imgs.map((x) => x.src);
    });

    const [elbrand] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/p',);
    const brandText = await elbrand.getProperty('textContent');
    const brand = await brandText.jsonValue();

    const [elProductNumber] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[2]');
    const prodNr = await elProductNumber.getProperty('textContent');
    const productNumber = await prodNr.jsonValue();

    const [elShortDescription] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/p/text()');
    const textShortDescription = await elShortDescription.getProperty('textContent');
    const ShortDescription = await textShortDescription.jsonValue();
   

    const [elCollumnName] = await page.$x('//*[@id="description-header"]/div[1]/h2');
    const textelCollumnName = await elCollumnName.getProperty('textContent');
    const collumnName = await textelCollumnName.jsonValue();

    const [elDescription] = await page.$x('//*[@id="description-header"]/div[1]/h2');
    const textelDescription = await elDescription.getProperty('textContent');
    const description = await textelDescription.jsonValue();


    browser.close();
    console.log({productName, picture1, images, brand, productNumber, ShortDescription, 
        collumnName, description,  
    });
}

//scrapeProductPage('https://www.dahl.no/varme/beredere/boligberedere/saga-bd_1507791616794?v=BD_8000554');

scrapeProductPage(siteLink.productLink);