const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());
const siteLink = require('./project-objectives');

async function scrapeProductPage(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    await page.setViewport({ width: 1030, height: 768 });

    const allAdds = [];

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(1000);

    const [el] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/h2');
    const text = await el.getProperty('textContent');
    const productName = await text.jsonValue();

    //cover picture
    const [el2] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div/div[1]/div/img');
    const src = await el2.getProperty('src');
    const coverPic = await src.jsonValue();
    
    //returns all pictures
    // const images = await page.$$eval("img", (imgs) => {
    //     return imgs.map((x) => x.src);
    // });

    //--- works but returns url without apendix
    // try {
    //     const elPic1 = (await page.$x('/html/body/div/div/div/div[1]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[2]'))[0];
    //     let v = await page.$eval("img", elPic1 => elPic1.getAttribute("src"))
    // } catch (error) {
        
    // }

    let pic1 = '';
    try {
        const [elPic1] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[1]/div/img');
        const srcel1 = await elPic1.getProperty('src');
        pic1 = await srcel1.jsonValue();
    } catch (error) {}
    
    let pic2 = '';
    try {
        const [elPic2] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[2]/div/img');
        const srcel2 = await elPic2.getProperty('src');
        pic2 = await srcel2.jsonValue();
    } catch (error) {}

    let pic3 = '';
    try {
        const [elPic3] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[3]/div/img');
        const srcel3 = await elPic3.getProperty('src');
        pic3 = await srcel3.jsonValue();       
    } catch (error) {}

    let pic4 = '';
    try {
        const [elPic4] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[4]/div/img');
        const srcel4 = await elPic4.getProperty('src');
        pic4 = await srcel4.jsonValue();  
    } catch (error) {}

    const [elbrand] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/p',);
    const brandText = await elbrand.getProperty('textContent');
    const brand = await brandText.jsonValue();
                                             
                                             //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[2]  returs gap beatween strings
    const [elProductNumber] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[3]');
    const prodNr = await elProductNumber.getProperty('textContent');
    const productNumber = await prodNr.jsonValue();

    const [elShortDescription] = await page.$x('//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/p/text()');
    const textShortDescription = await elShortDescription.getProperty('textContent');
    const ShortDescription = await textShortDescription.jsonValue();
   
    const [elCollumnName] = await page.$x('//*[@id="description-header"]/div[1]/h2');
    const textelCollumnName = await elCollumnName.getProperty('textContent');
    const collumnName = await textelCollumnName.jsonValue();

    const [elDescription] = await page.$x('//*[@id="description-content"]/div/div/div/text()');
    const textelDescription = await elDescription.getProperty('textContent');
    const description = await textelDescription.jsonValue();

//specifications
    const [elCollumnName2] = await page.$x('//*[@id="specifications-header"]/div[1]/h2');
    const textelCollumnName2 = await elCollumnName2.getProperty('textContent');
    const collumnName2 = await textelCollumnName2.jsonValue();

    const specifications =[];

    const productsHandles = await page.$$('#specifications-content > div > div > ul > li');
    for (const producthandle of productsHandles){
        
        try {
            const title = await page.evaluate(
                (el) => el.querySelector(" p").textContent,
                producthandle
            );

            const value = await page.evaluate(
                (el) => el.textContent,
                producthandle
            );

            let newValue = value.replace(title, "");

            specifications.push({title: title, value: newValue})

        } catch (error) {
            console.log("error", error)
        }
    }

//etim
    const [elCollumnName3] = await page.$x('//*[@id="etimspecifications-header"]/div[1]/h2');
    const textelCollumnName3 = await elCollumnName3.getProperty('textContent');
    const collumnName3 = await textelCollumnName3.jsonValue();

    const etim =[]; 

    const productsHandlesetim = await page.$$('#etimspecifications-content > div > div > ul > li');
    for (const producthandle of productsHandlesetim){
        
        try {
            const title = await page.evaluate(
                (el) => el.querySelector(" p").textContent,
                producthandle
            );

            const value = await page.evaluate(
                (el) => el.textContent,
                producthandle
            );

            let newValue = value.replace(title, "");

            etim.push({title: title, value: newValue})

        } catch (error) {
            console.log("error", error)
        }
    }

    const [elCollumnName4] = await page.$x('//*[@id="documents-header"]/div[1]/h2');
    const textelCollumnName4 = await elCollumnName4.getProperty('textContent');
    const collumnName4 = await textelCollumnName4.jsonValue();

    const [el3] = await page.$x('//*[@id="documents-content"]/div/div/div/a');
    const textContentel3 = await el3.getProperty('textContent');
    const documentstextContent = await textContentel3.jsonValue();

    const [el4] = await page.$x('//*[@id="documents-content"]/div/div/div/a');
    const href = await el4.getProperty('href');
    const documentsLink = await href.jsonValue();

    
    

    browser.close();
    console.log({productName, coverPic, pic1, pic2, pic3, pic4, brand, productNumber, ShortDescription,
        collumnName, description, collumnName2, specifications, etim, collumnName4, documentstextContent, documentsLink, 
    });
}


scrapeProductPage(siteLink.productLink);
