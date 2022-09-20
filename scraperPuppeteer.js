const { ConsoleMessage } = require("puppeteer");
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());
const siteLink = require("./project-objectives");
const createCSV = require("csv-writer").createObjectCsvWriter;
const fs = require('fs');
const jsonfile = require('jsonfile')
const cookies = require('./tmp/cookies.json')

let totalSrapes = 0;

let mainHeader = [
    { id: "category1", title: "CATEGORY 1" },
    { id: "category2", title: "CATEGORY 2" },
    { id: "category3", title: "CATEGORY 3" },
    { id: "category4", title: "CATEGORY 4" },
    { id: "productName", title: "PRODUC NAME" },
    { id: "coverPic", title: "COVER PICTURE" },
    { id: "pic1", title: "pic1" },
    { id: "pic2", title: "pic2" },
    { id: "pic3", title: "pic3" },
    { id: "pic4", title: "pic4" },
    { id: "brand", title: "brand" },
    { id: "productNumber", title: "productNumber" },
    { id: "ShortDescription", title: "ShortDescription" },
    { id: "saleQuatity", title: "saleQuatity" },
    { id: "price", title: "price" },
    { id: "collumnName", title: "collumnName" },
    { id: "description", title: "description" },
    { id: "collumnName2", title: "collumnName2" },
];

let mainSource = [];


async function scrapeProductPage(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
    );
    await page.setViewport({ width: 1030, height: 768 });

    // If file exist load the cookies
    const file = './tmp/cookies.json'
    const fileExists = jsonfile.readFileSync(file);
    if (fileExists) {
        const cookiesArr = cookies;
        if (cookiesArr.length !== 0) {
            await page.setCookie(...cookies);
            // const cookiesSet = await page.cookies(url);
            // console.log(JSON.stringify(cookiesSet));

            console.log('Session has been loaded in the browser!')
            //return true;
        }
    }

    const variantsUrls = [];
    let scrapeOneLevelDeep = true;


    // // (B) CREATE NEW CSV DOCUMENT
    // const csv = createCSV({
    //     path: "scrapedProduct.csv",
    //     header: [
    //         { id: "productName", title: "PRODUC NAME" },
    //         { id: "coverPic", title: "COVER PICTURE" },
    //         { id: "pic1", title: "pic1"},
    //         { id: "pic2", title: "pic2"},
    //         { id: "pic3", title: "pic3"},
    //         { id: "pic4", title: "pic4"}
    //     ],
    // });

    async function scrape(productUrl) {



        await page.goto(productUrl, { waitUntil: "networkidle2" });
        await page.waitForTimeout(1000);

        let category1 = '';
        try {
            const [el01] = await page.$x(
                '//*[@id="content-container"]/main/div[1]/ul/li[1]/a'
            );
            const textel01 = await el01.getProperty("textContent");
            category1 = await textel01.jsonValue();
        } catch (error) {
            console.log('cant find categori 1')
        }

        let category2 = '';
        try {
            const [el02] = await page.$x(
                '//*[@id="content-container"]/main/div[1]/ul/li[2]/a'
            );
            const textel02 = await el02.getProperty("textContent");
            category2 = await textel02.jsonValue();
        } catch (error) {
            console.log('cant find categori 2')
        }

        let category3 = '';
        try {
            const [el03] = await page.$x(
                '//*[@id="content-container"]/main/div[1]/ul/li[3]/a'
            );
            const textel03 = await el03.getProperty("textContent");
            category3 = await textel03.jsonValue();
        } catch (error) {
            console.log('cant find categori 3')
        }

        let category4 = '';
        try {
            const [el04] = await page.$x(
                '//*[@id="content-container"]/main/div[1]/ul/li[4]/a'
            );
            const textel04 = await el04.getProperty("textContent");
            category4 = await textel04.jsonValue();
        } catch (error) {
            console.log('cant find categori 4')
        }

        let productName = '';
        try {
            const [el] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/h2'
            );
            const text = await el.getProperty("textContent");
            productName = await text.jsonValue();
        } catch (error) {
            console.log('cant find productName')
        }

        //cover picture
        const [el2] = await page.$x(
            '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div/div[1]/div/img'
        );
        const src = await el2.getProperty("src");
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

        let pic1 = "";
        try {
            const [elPic1] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[1]/div/img'
            );
            const srcel1 = await elPic1.getProperty("src");
            pic1 = await srcel1.jsonValue();
        } catch (error) { }

        let pic2 = "";
        try {
            const [elPic2] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[2]/div/img'
            );
            const srcel2 = await elPic2.getProperty("src");
            pic2 = await srcel2.jsonValue();
        } catch (error) { }

        let pic3 = "";
        try {
            const [elPic3] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[3]/div/img'
            );
            const srcel3 = await elPic3.getProperty("src");
            pic3 = await srcel3.jsonValue();
        } catch (error) { }

        let pic4 = "";
        try {
            const [elPic4] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[4]/div/img'
            );
            const srcel4 = await elPic4.getProperty("src");
            pic4 = await srcel4.jsonValue();
        } catch (error) { }

        const [elbrand] = await page.$x(
            '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/p'
        );
        const brandText = await elbrand.getProperty("textContent");
        const brand = await brandText.jsonValue();

        //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[2]  returs gap beatween strings
        const [elProductNumber] = await page.$x(
            '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[3]'
        );
        const prodNr = await elProductNumber.getProperty("textContent");
        const productNumber = await prodNr.jsonValue();

        let ShortDescription = "";
        try {
            const [elShortDescription] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/p/text()'
            );
            const textShortDescription = await elShortDescription.getProperty(
                "textContent"
            );
            ShortDescription = await textShortDescription.jsonValue();
        } catch (error) { }

        let saleQuatity = "";
        try {
            const [elsaleQuatity] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/div[1]/div[1]'
            );
            const textelsaleQuatity = await elsaleQuatity.getProperty("textContent");
            saleQuatity = await textelsaleQuatity.jsonValue();
        } catch (error) { }

        let price = "";
        try {
            const [elprice] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/div[1]/span/div/span'
            );
            const texteelprice = await elprice.getProperty("textContent");
            price = await texteelprice.jsonValue();
        } catch (error) { }

        const [elCollumnName] = await page.$x(
            '//*[@id="description-header"]/div[1]/h2'
        );
        const textelCollumnName = await elCollumnName.getProperty("textContent");
        const collumnName = await textelCollumnName.jsonValue();

        const [elDescription] = await page.$x(
            '//*[@id="description-content"]/div/div/div/text()'
        );
        const textelDescription = await elDescription.getProperty("textContent");
        const description = await textelDescription.jsonValue();

        //specifications
        const [elCollumnName2] = await page.$x(
            '//*[@id="specifications-header"]/div[1]/h2'
        );
        const textelCollumnName2 = await elCollumnName2.getProperty("textContent");
        const collumnName2 = await textelCollumnName2.jsonValue();

        const specifications = [];

        const productsHandles = await page.$$(
            "#specifications-content > div > div > ul > li"
        );
        for (const producthandle of productsHandles) {
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

                // specifications[title] = title;
                // specifications[value] = newValue;
                specifications.push({ title: title, value: newValue });
            } catch (error) {
                console.log("error", error);
            }
        }

        //etim
        const [elCollumnName3] = await page.$x(
            '//*[@id="etimspecifications-header"]/div[1]/h2'
        );
        const textelCollumnName3 = await elCollumnName3.getProperty("textContent");
        const collumnName3 = await textelCollumnName3.jsonValue();

        const etim = [];

        const productsHandlesetim = await page.$$(
            "#etimspecifications-content > div > div > ul > li"
        );
        for (const producthandle of productsHandlesetim) {
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

                etim.push({ title: title, value: newValue });
            } catch (error) {
                console.log("error", error);
            }
        }

        const [elCollumnName4] = await page.$x(
            '//*[@id="documents-header"]/div[1]/h2'
        );
        const textelCollumnName4 = await elCollumnName4.getProperty("textContent");
        const collumnName4 = await textelCollumnName4.jsonValue();

        const [el3] = await page.$x('//*[@id="documents-content"]/div/div/div/a');
        const textContentel3 = await el3.getProperty("textContent");
        const documentstextContent = await textContentel3.jsonValue();

        const [el4] = await page.$x('//*[@id="documents-content"]/div/div/div/a');
        const href = await el4.getProperty("href");
        const documentsLink = await href.jsonValue();

        let collumnNameVariations = "";
        const variations = [];
        try {
            const [elCollumnName5] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/h3'
            );
            const textelCollumnName5 = await elCollumnName5.getProperty(
                "textContent"
            );
            collumnNameVariations = await textelCollumnName5.jsonValue();

            // #content-container > main > div.n.o.c1.q > div:nth-child(2) > div:nth-child(2) > div.b2.go.dx.gp > article:nth-child(1)
            const productsHandlesVar = await page.$$(
                "#content-container > main > div > div:nth-child(2) > div:nth-child(2) > div > article"
            );
            //#content-container > main > div.n.o.c1.q > div:nth-child(2) > div:nth-child(2) > div > article:nth-child(1)
            //#content-container > main > div.n.o.c1.q > div:nth-child(2) > div.n.o.p.b1.hc > div > div > div > div > div:nth-child(1) > article > a > section
            for (const producthandle of productsHandlesVar) {
                //#content-container > main > div.n.o.c1.q > div:nth-child(2) > div:nth-child(2) > div.b2.go.dx.gp > article:nth-child(1) > a > section > div:nth-child(1) > h3
                try {
                    const title = await page.evaluate(
                        // article:nth-child(1) > a > section > div:nth-child(1) > h3
                        (el) => el.querySelector(" a > section > div> h3").textContent,
                        producthandle
                    );

                    const variantproductNumber = await page.evaluate(
                        (el) => el.querySelector(" p ").textContent,
                        producthandle
                    );
                    // const links = await page.evaluate(function getUrls() {
                    //     return Array.from(document.querySelectorAll('a cite').values()).
                    //       map(el => el.innerHTML);
                    //   });

                    // const elvariationUrl = await page.evaluate(
                    //      (el) => el.querySelector('a').getProperty('href'),
                    //     // .querySelector(" a > section > div> h3").textContent,
                    //      producthandle
                    // );
                    //const variationUrl = await elvariationUrl.jsonValue();

                    let newValue = variantproductNumber.replace("NRF ", "");

                    variations.push({
                        title: title,
                        variantionProductNumber: newValue,
                    });
                } catch (error) {
                    console.log("error", error);
                }
            }
        } catch (error) { }
        // console.log({
        //     category1,
        //     category2,
        //     category3,
        //     category4,
        //     productName,
        //     coverPic,
        //     pic1,
        //     pic2,
        //     pic3,
        //     pic4,
        //     brand,
        //     productNumber,
        //     ShortDescription,
        //     saleQuatity,
        //     price,
        //     collumnName,
        //     description,
        //     collumnName2,
        //     specifications,
        //     collumnName3,
        //     etim,
        //     collumnName4,
        //     documentstextContent,
        //     documentsLink,
        //     collumnNameVariations,
        //     variations,
        // });

        // working with data------------------------------------------------ ↓↓↓

        // bulding CSV Writer data sets
        let header = [
            { id: "category1", title: "CATEGORY 1" },
            { id: "category2", title: "CATEGORY 2" },
            { id: "category3", title: "CATEGORY 3" },
            { id: "category4", title: "CATEGORY 4" },
            { id: "productName", title: "PRODUC NAME" },
            { id: "coverPic", title: "COVER PICTURE" },
            { id: "pic1", title: "pic1" },
            { id: "pic2", title: "pic2" },
            { id: "pic3", title: "pic3" },
            { id: "pic4", title: "pic4" },
            { id: "brand", title: "brand" },
            { id: "productNumber", title: "productNumber" },
            { id: "ShortDescription", title: "ShortDescription" },
            { id: "saleQuatity", title: "saleQuatity" },
            { id: "price", title: "price" },
            { id: "collumnName", title: "collumnName" },
            { id: "description", title: "description" },
            { id: "collumnName2", title: "collumnName2" },
        ]



        //console.log("LOGING HEADER: -----------", header);

        const source =
        {
            category1: category1, category2: category2, category3: category3, category4: category4,
            productName: productName, coverPic: coverPic, pic1: pic1, pic2: pic2, pic3: pic3, pic4: pic4,
            brand: brand, productNumber: productNumber, ShortDescription: ShortDescription, saleQuatity: saleQuatity,
            price: price, collumnName: collumnName, description: description, collumnName2: collumnName2,
        };

        //console.log("-------------------------source-----------------------");
        //console.log(source);


        // remove colon from titles and add to header



        for (const iterator of specifications) {
            let title = iterator.title;
            let newTitle = title.replace(": ", "");
            iterator.title = newTitle;
            header.push({ id: iterator.title, title: iterator.title });
            header.push({ id: 'spec ' + iterator.title, title: 'spec ' + iterator.title });
            source[iterator.title] = iterator.title;
            source['spec ' + iterator.title] = iterator.value;
            //--add to maisSource

            (function add(mainHeader, iterator) {

                const found = mainHeader.some(el => el.id === iterator.title);
                if (!found) console.log("NOT FOUND: ", iterator.title);
                if (!found) mainHeader.push({ id: iterator.title, title: iterator.title });
                if (!found) mainHeader.push({ id: 'spec ' + iterator.title, title: 'spec ' + iterator.title });
                return mainHeader;

            })(mainHeader, iterator);
            //-- end of it


        };

        (function add(header, item) {

            const found = header.some(el => el.id === item);
            if (!found) console.log("NOT FOUND: ", item);
            if (!found) header.push({ id: item, title: item });
            if (!found) source['collumnName3'] = collumnName3;
            return header;

        })(header, collumnName3);

        //--add to maisSource

        (function add(mainHeader, item) {

            const found = mainHeader.some(el => el.id === item);
            if (!found) mainHeader.push({ id: item, title: item });
            return mainHeader;

        })(mainHeader, collumnName3);
        //-- end of it

        for (const iterator of etim) {
            let title = iterator.title;
            let newTitle = title.replace(": ", "");
            iterator.title = newTitle;
            header.push({ id: iterator.title, title: iterator.title });
            header.push({ id: 'etim ' + iterator.title, title: 'etim ' + iterator.title });
            source[iterator.title] = iterator.title;
            source['etim ' + iterator.title] = iterator.value;

            //--add to maisSource

            (function add(mainHeader, iterator) {

                const found = mainHeader.some(el => el.id === iterator.title);
                if (!found) console.log("NOT FOUND: ", iterator.title);
                if (!found) mainHeader.push({ id: iterator.title, title: iterator.title });
                if (!found) mainHeader.push({ id: 'etim ' + iterator.title, title: 'etim ' + iterator.title });
                return mainHeader;

            })(mainHeader, iterator);
            //-- end of it

        };

        for (const iterator of variations) {
            header.push({ id: iterator.title, title: iterator.title });
            header.push({ id: 'variantion ' + iterator.title, title: 'variantion ' + iterator.title });
            source[iterator.title] = iterator.title;
            source['variantion ' + iterator.title] = iterator.variantionProductNumber;
            //--add to maisSource

            (function add(mainHeader, iterator) {

                const found = mainHeader.some(el => el.id === iterator.title);
                if (!found) console.log("NOT FOUND: ", iterator.title);
                if (!found) mainHeader.push({ id: iterator.title, title: iterator.title });
                if (!found) mainHeader.push({ id: 'variantion ' + iterator.title, title: 'variantion ' + iterator.title });
                return mainHeader;

            })(mainHeader, iterator);
            //-- end of it
        };

        //--add to maisSource

        (function add(mainHeader, item) {

            const found = mainHeader.some(el => el.id === item);
            if (!found) console.log("NOT FOUND: ", item);
            if (!found) mainHeader.push({ id: item, title: item });
            if (!found) header.push({ id: item, title: item });
            return mainHeader;

        })(mainHeader, 'productUrl ');
        //-- end of it

        source['productUrl '] = productUrl;

        mainSource.push(source);

        // //  CREATE NEW CSV DOCUMENT
        // const csv = createCSV({
        //     path: `${productName}.csv`,
        //     header: header
        // });

        // //  WRITE DATA ROWS
        // await csv.writeRecords([
        //     source

        //     ])
        //     .then(() => {
        //         console.log("Done!");
        //     });


        const urlsVariants = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll(
                    "#content-container > main > div > div > div > div > article > a"
                ),
                (link) => link.href
            )
        );

        // console.log("urlsVariants", urlsVariants);

        if (scrapeOneLevelDeep) {
            if (urlsVariants.length > 0) {
                variantsUrls.length = 0;
                for (const iterator of urlsVariants) {
                    variantsUrls.push(iterator);
                }
                scrapeOneLevelDeep = false;
            }
        }

        totalSrapes++;
        console.log("totatl scrapes: ", totalSrapes);

        // console.log("-------------------------header-----------------------");
        // console.log(header);
        // console.log("-------------------------mainHeader-----------------------");
        // console.log(mainHeader);
        // console.log("-------------------------mainSource-----------------------");
        // console.log(mainSource);
        const obj = { header, mainHeader, mainSource }

        fs.writeFile("log.txt", JSON.stringify(obj), function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    }

    await scrape(url);

    //scrape variantions
    if (!scrapeOneLevelDeep) {
        for (const varUrl of variantsUrls) {
            await scrape(varUrl);
        }
        scrapeOneLevelDeep = true;
    }


    //  CREATE NEW CSV DOCUMENT
    const csv = createCSV({
        // path: `${productName}.csv`,
        path: 'results.csv',
        header: mainHeader
    });

    //  WRITE DATA ROWS
    await csv.writeRecords(
        mainSource

    )
        .then(() => {
            console.log("Done!");
        });

    browser.close();
}

scrapeProductPage(siteLink.productLink);




