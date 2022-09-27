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



async function scrapeProductPage(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
    );
    await page.setViewport({ width: 1030, height: 768 });

    // If file exist load the cookies
    const file = './tmp/cookies.json'
    const cookiesExists = jsonfile.readFileSync(file);
    let logedIn = false;
    if (cookiesExists) {
        const cookiesArr = cookies;
        if (cookiesArr.length !== 0) {
            await page.setCookie(...cookies);
            // const cookiesSet = await page.cookies(url);
            // console.log(JSON.stringify(cookiesSet));

            console.log('Session has been loaded in the browser!')
            //return true;
        }
    }
    let fileName = 'results';
    let setFileName = true;

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
        { id: "salePrice", title: "salePrice" },
        { id: "nettStorage", title: "nettStorage" },
        { id: "collumnName", title: "collumnName" },
        { id: "description", title: "description" },
        { id: "collumnName2", title: "collumnName2" },
    ];

    let mainSource = [];

    const variantsUrls = [];
    let scrapeOneLevelDeep = true;


    async function scrape(productUrl) {



        await page.goto(productUrl, { waitUntil: "networkidle2" });
        // await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.waitForTimeout(1000);

        //todo check is it login needed 
        //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/div/button/text()
        // button //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/div/button
        // text: Logg inn for å handle

        let loginButton = '';
        try {
            const [el01] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/div/button'
            );
            const textel01 = await el01.getProperty("textContent");
            loginButton = await textel01.jsonValue();
        } catch (error) {
            // console.log('cant find login for a handle');
        }

        if (loginButton === 'Logg inn for å handle') {
            console.log('Found Button to login');
            logedIn = false;
        } else {
            logedIn = true;
        }


        let category1 = '';
        try {
            const [el01] = await page.$x(
                '//*[@id="content-container"]/main/div[1]/ul/li[1]/a'
            );
            const textel01 = await el01.getProperty("textContent");
            category1 = await textel01.jsonValue();
        } catch (error) {
            console.log('cant find categori 1');
        }

        let category2 = '';
        try {
            const [el02] = await page.$x(
                '//*[@id="content-container"]/main/div[1]/ul/li[2]/a'
            );
            const textel02 = await el02.getProperty("textContent");
            category2 = await textel02.jsonValue();
        } catch (error) {
            console.log('cant find categori 2');
        }

        let category3 = '';
        try {
            const [el03] = await page.$x(
                '//*[@id="content-container"]/main/div[1]/ul/li[3]/a'
            );
            const textel03 = await el03.getProperty("textContent");
            category3 = await textel03.jsonValue();
        } catch (error) {
            console.log('cant find categori 3');
        }

        let category4 = '';
        try {
            const [el04] = await page.$x(
                '//*[@id="content-container"]/main/div[1]/ul/li[4]/a'
            );
            const textel04 = await el04.getProperty("textContent");
            category4 = await textel04.jsonValue();
        } catch (error) {
            //console.log('cant find categori 4');
        }

        let xPath = ''
        let productName = '';
        try {
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/h2
            // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/h2
            //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/h2
            //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/h2

            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/h2'
            if (logedIn) {
                xPath =
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/h2';
            }

            const [el] = await page.$x(xPath);
            const text = await el.getProperty("textContent");
            productName = await text.jsonValue();
        } catch (error) {
            console.log('cant find productName', error);
        }

        if (productName !== '') {
            console.log('productName ', productName)
        }

        //cover picture
        let coverPic = '';
        try {
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div/div[1]/div/img
            // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div/div[1]/div/img
            //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div/img


            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div/div[1]/div/img'
            if (logedIn) {
                xPath =
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div/div[1]/div/img';
            }

            const [el2] = await page.$x(xPath);
            const src = await el2.getProperty("src");
            coverPic = await src.jsonValue();
        } catch (error) {
            console.log('cant find coverPic try other xpath');

            try {
                xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div/div[1]/div/img'
                if (logedIn) {
                    xPath =
                        '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div/img';
                }

                const [el2] = await page.$x(xPath);
                const src = await el2.getProperty("src");
                coverPic = await src.jsonValue();
            } catch (error) {
                console.log('cant find coverPic 2 version try other xpath ');

                try {
                    xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div/img'
                    if (logedIn) {
                        xPath =
                            '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div/img';
                    }

                    const [el2] = await page.$x(xPath);
                    const src = await el2.getProperty("src");
                    coverPic = await src.jsonValue();
                } catch (error) {
                    console.log('cant find coverPic 3 version xpath GIVING UP!!!', error);
                }
            }
        }

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
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[1]/div/img
            // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/button[1]/div/img

            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[1]/div/img'
            if (logedIn) {
                xPath =
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/button[1]/div/img';
            }

            const [elPic1] = await page.$x(xPath);
            const srcel1 = await elPic1.getProperty("src");
            pic1 = await srcel1.jsonValue();
        } catch (error) { console.log('cant find pic1'); }

        if (pic1 === "") {
            pic1 = coverPic;
        }

        let pic2 = "";
        try {
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[2]/div/img
            // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/button[2]/div/img
            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[2]/div/img'
            if (logedIn) {
                xPath =
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/button[2]/div/img';
            }

            const [elPic2] = await page.$x(xPath);
            const srcel2 = await elPic2.getProperty("src");
            pic2 = await srcel2.jsonValue();
        } catch (error) { console.log('cant find pic2'); }

        let pic3 = "";
        try {
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[3]/div/img
            // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/button[3]/div/img
            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[3]/div/img'
            if (logedIn) {
                xPath =
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/button[3]/div/img';
            }

            const [elPic3] = await page.$x(xPath);
            const srcel3 = await elPic3.getProperty("src");
            pic3 = await srcel3.jsonValue();
        } catch (error) { console.log('cant find pic3'); }

        let pic4 = "";
        try {
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[4]/div/img
            // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/button[4]/div/img
            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[1]/div/div[2]/div/div/button[4]/div/img'
            if (logedIn) {
                xPath =
                    ' //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/button[4]/div/img';
            }

            const [elPic4] = await page.$x(xPath);
            const srcel4 = await elPic4.getProperty("src");
            pic4 = await srcel4.jsonValue();
        } catch (error) {
            //console.log('cant find pic4'); 
        }

        let brand = '';
        // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/p
        // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/div[1]/p/a
        try {
            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/p'
            if (logedIn) {
                xPath =
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/div[1]/p/a';
            }

            const [elbrand] = await page.$x(xPath);
            const brandText = await elbrand.getProperty("textContent");
            brand = await brandText.jsonValue();
        } catch (error) {
            console.log('cant find brand, trying other xpaths');

            try {
                if (logedIn) {
                    xPath =
                        '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/div[2]/p/a';
                }

                const [elbrand] = await page.$x(xPath);
                const brandText = await elbrand.getProperty("textContent");
                brand = await brandText.jsonValue();
            } catch (error) {
                console.log('cant find brand, givingUP');
            }
        }

        let productNumber = '';
        try {                   
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[2]  returs gap beatween strings
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[1] NRF
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[3] Number
            // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/div[1]/span/div/p/text()[2] Number
            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/div[1]/span/div/p/text()[3]'
    
            if (logedIn) {
                xPath =
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/div[1]/span/div/p/text()[3]';
            }

            const [elProductNumber] = await page.$x(xPath);

            const prodNr = await elProductNumber.getProperty("textContent");
            productNumber = await prodNr.jsonValue();
        } catch (error) {
            console.log('cant find productNumber, trying loged in version path');

            try {
                const [elProductNumber] = await page.$x(
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/div[2]/span/div/p/text()[3]'
                );
                const prodNr = await elProductNumber.getProperty("textContent");
                productNumber = await prodNr.jsonValue();
            } catch (error) {
                console.log('stil cant find productNumber in 3, trying other xpath');
                try {
                    const [elProductNumber] = await page.$x(
                        '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/div[2]/span/div/p/text()[2]'
                    );
                    const prodNr = await elProductNumber.getProperty("textContent");
                    productNumber = await prodNr.jsonValue();
                } catch (error) {
                    console.log('stil cant find productNumber in 2, trying other xpath');

                    try {
                        const [elProductNumber] = await page.$x(
                            '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/div[1]/span/div/p/text()[1]'
                        );
                        const prodNr = await elProductNumber.getProperty("textContent");
                        productNumber = await prodNr.jsonValue();
                    } catch (error) {
                        console.log('stil cant find productNumber in 1, giving up');
                    }
                }
            }

        }

        let ShortDescription = "";
        try {
            // not loged in ver //*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/p/text()
            // loged in version //*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/p/text()

            xPath = '//*[@id="content-container"]/main/div[2]/div[2]/div[1]/div[2]/section/hgroup/p/text()'
            if (logedIn) {
                xPath =
                    '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/hgroup/p/text()';
            }

            const [elShortDescription] = await page.$x(xPath);
            const textShortDescription = await elShortDescription.getProperty("textContent");
            ShortDescription = await textShortDescription.jsonValue();

        } catch (error) { console.log('cant find ShortDescription'); }

        let saleQuatity = "";
        try {
            const [elsaleQuatity] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/div[1]/div[1]'
            );
            const textelsaleQuatity = await elsaleQuatity.getProperty("textContent");
            saleQuatity = await textelsaleQuatity.jsonValue();
        } catch (error) { console.log('cant find saleQuatity'); }

        let price = "";
        try {
            const [elprice] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/div[1]/span/div/span'
            );
            const texteelprice = await elprice.getProperty("textContent");
            price = await texteelprice.jsonValue();
        } catch (error) { console.log('cant find price'); }
        let newPrice = price.replace("kr ", "");

        let salePrice = "";
        try {
            const [elsalePrice] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/div[1]/span/div[2]/span'
            );
            const texteelsalePrice = await elsalePrice.getProperty("textContent");
            salePrice = await texteelsalePrice.jsonValue();
        } catch (error) { 
            // console.log('cant find price');
        }
        let newsalePrice = salePrice.replace("kr ", "");

        let nettStorage = '';
        try {
            const [elnettStorage] = await page.$x(
                '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[2]/section/div[2]/div/div/span'
            );
            const texteelnettStorage = await elnettStorage.getProperty("textContent");
            nettStorage = await texteelnettStorage.jsonValue();
        } catch (error) { console.log('cant find nettStorage'); }
        //let newnettStorage = nettStorage.replace("Nettlager ", "");

        let collumnName = '';
        try {
            const [elCollumnName] = await page.$x(
                '//*[@id="description-header"]/div[1]/h2'
            );
            const textelCollumnName = await elCollumnName.getProperty("textContent");
            collumnName = await textelCollumnName.jsonValue();
        } catch (error) {
            console.log('cant find collumnName');
        }

        let description = '';
        try {
            const [elDescription] = await page.$x(
                '//*[@id="description-content"]/div/div/div/text()'
            );
            const textelDescription = await elDescription.getProperty("textContent");
            description = await textelDescription.jsonValue();
        } catch (error) {
            console.log('cant find description');
        }

        //specifications
        let collumnName2 = '';
        try {
            const [elCollumnName2] = await page.$x(
                '//*[@id="specifications-header"]/div[1]/h2'
            );
            const textelCollumnName2 = await elCollumnName2.getProperty("textContent");
            collumnName2 = await textelCollumnName2.jsonValue();
        } catch (error) {
            console.log('cant find collumnName2 (specifications)', error);
        }

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
                console.log("Cant get specifications array", error);
            }
        }

        //etim
        let collumnName3 = '';
        try {
            const [elCollumnName3] = await page.$x(
                '//*[@id="etimspecifications-header"]/div[1]/h2'
            );
            const textelCollumnName3 = await elCollumnName3.getProperty("textContent");
            collumnName3 = await textelCollumnName3.jsonValue();
        } catch (error) {
            console.log("cant find collumnName3 (ETIM)", error);
        }

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
                console.log("productsHandlesetim error", error);
            }
        }

        let collumnName4 = '';
        try {
            const [elCollumnName4] = await page.$x(
                '//*[@id="documents-header"]/div[1]/h2'
            );
            const textelCollumnName4 = await elCollumnName4.getProperty("textContent");
            collumnName4 = await textelCollumnName4.jsonValue();
        } catch (error) {
            console.log("cant find collumnName4 (documentation)", error);
        }

        let documentstextContent = '';
        let documentstextContent1 = '';
        let documentstextContent2 = '';
        let documentstextContent3 = '';
        //*[@id="documents-content"]/div/div/div/a
        //*[@id="documents-content"]/div/div/div[1]/a
        //*[@id="documents-content"]/div/div/div[2]/a
        try {

            const [el3] = await page.$x('//*[@id="documents-content"]/div/div/div/a');
            const textContentel3 = await el3.getProperty("textContent");
            documentstextContent = await textContentel3.jsonValue();

        } catch (error) {
            console.log("cant find documentstextContent (documentation) tring search in array  Nr 1  ");

            try {
                const [el3a] = await page.$x('//*[@id="documents-content"]/div/div/div[1]/a');
                const textContentel3a = await el3a.getProperty("textContent");
                documentstextContent = await textContentel3a.jsonValue();

            } catch (error) {
                console.log("cant find documentstextContent (documentation) Nr 1 ");
            }

            try {
                const [el3b] = await page.$x('//*[@id="documents-content"]/div/div/div[2]/a');
                const textContentel3b = await el3b.getProperty("textContent ");
                documentstextContent1 = await textContentel3b.jsonValue();

            } catch (error) {
                console.log("cant find documentstextContent (documentation) Nr 2 ");
            }

            try {
                const [el3c] = await page.$x('//*[@id="documents-content"]/div/div/div[3]/a');
                const textContentel3c = await el3c.getProperty("textContent");
                documentstextContent2 = await textContentel3c.jsonValue();

            } catch (error) {
                console.log("cant find documentstextContent (documentation) Nr 3");
            }

            try {
                const [el3d] = await page.$x('//*[@id="documents-content"]/div/div/div[4]/a');
                const textContentel3d = await el3d.getProperty("textContent");
                documentstextContent3 = await textContentel3d.jsonValue();

            } catch (error) {
                console.log("cant find documentstextContent (documentation) Nr 4");
            }
        }

        if (documentstextContent1 === '') {
            try {
                const [el3b] = await page.$x('//*[@id="documents-content"]/div/div/div[2]/a');
                const textContentel3b = await el3b.getProperty("textContent ");
                documentstextContent1 = await textContentel3b.jsonValue();

            } catch (error) {
                console.log("cant find documentstextContent (documentation) Nr 2 ");
            }

            try {
                const [el3c] = await page.$x('//*[@id="documents-content"]/div/div/div[3]/a');
                const textContentel3c = await el3c.getProperty("textContent");
                documentstextContent2 = await textContentel3c.jsonValue();

            } catch (error) {
                console.log("cant find documentstextContent (documentation) Nr 3");
            }

            try {
                const [el3d] = await page.$x('//*[@id="documents-content"]/div/div/div[4]/a');
                const textContentel3d = await el3d.getProperty("textContent");
                documentstextContent3 = await textContentel3d.jsonValue();

            } catch (error) {
                console.log("cant find documentstextContent (documentation) Nr 4");
            }
        }

        let documentsLink = '';
        let documentsLink1 = '';
        let documentsLink2 = '';
        let documentsLink3 = '';
        try {                       
            const [el4] = await page.$x('//*[@id="documents-content"]/div/div/div/a');
            const href = await el4.getProperty("href");
            documentsLink = await href.jsonValue();
        } catch (error) {
            console.log("cant find documentsLink (documentation) tring search in array    ");

            try {
                const [el4a] = await page.$x('//*[@id="documents-content"]/div/div/div[1]/a');
                const textContentel4a = await el4a.getProperty("href");
                documentsLink = await textContentel4a.jsonValue();

            } catch (error) {
                console.log("cant find documentsLink (documentation) Nr 1 ");
            }

            try {
                const [el4b] = await page.$x('//*[@id="documents-content"]/div/div/div[2]/a');
                const textContentel4b = await el4b.getProperty("href");
                documentsLink1 = await textContentel4b.jsonValue();

            } catch (error) {
                console.log("cant find documentsLink (documentation) Nr 2 ");
            }

            try {
                const [el4c] = await page.$x('//*[@id="documents-content"]/div/div/div[3]/a');
                const textContentel4c = await el4c.getProperty("href");
                documentsLink2 = await textContentel4c.jsonValue();

            } catch (error) {
                console.log("cant find documentsLink (documentation) Nr 3");
            }

            try {
                const [el4d] = await page.$x('//*[@id="documents-content"]/div/div/div[4]/a');
                const textContentel4d = await el4d.getProperty("href");
                documentsLink3 = await textContentel4d.jsonValue();

            } catch (error) {
                console.log("cant find documentsLink (documentation) Nr 4 ");
            }
        }

        if (documentsLink1 === '') {
            try {
                const [el4b] = await page.$x('//*[@id="documents-content"]/div/div/div[2]/a');
                const textContentel4b = await el4b.getProperty("href");
                documentsLink1 = await textContentel4b.jsonValue();

            } catch (error) {
                console.log("cant find documentsLink (documentation) Nr 2");
            }

            try {
                const [el4c] = await page.$x('//*[@id="documents-content"]/div/div/div[3]/a');
                const textContentel4c = await el4c.getProperty("href");
                documentsLink2 = await textContentel4c.jsonValue();

            } catch (error) {
                console.log("cant find documentsLink (documentation) Nr 3 ");
            }

            try {
                const [el4d] = await page.$x('//*[@id="documents-content"]/div/div/div[4]/a');
                const textContentel4d = await el4d.getProperty("href");
                documentsLink3 = await textContentel4d.jsonValue();

            } catch (error) {
                console.log("cant find documentsLink (documentation) Nr 4 ");
            }
        }

        // let collumnNameVariations = ""; NOT USING
        const variations = [];
        try {
            // const [elCollumnName5] = await page.$x(
            //     '//*[@id="content-container"]/main/div[2]/div[2]/div[2]/div[1]/h3'
            // );
            // const textelCollumnName5 = await elCollumnName5.getProperty(
            //     "textContent"
            // );
            // collumnNameVariations = await textelCollumnName5.jsonValue();

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
                    console.log("Cnat get Variations 2", error);
                }
            }
        } catch (error) { console.log("Cnat get Variations 1", error); }
        

        // working with data------------------------------------------------ ↓↓↓

        // bulding CSV Writer data sets
        // static header
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
            { id: "salePrice", title: "salePrice" },
            { id: "nettStorage", title: "nettStorage" },
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
            price: newPrice, salePrice: newsalePrice, nettStorage: nettStorage, collumnName: collumnName, description: description, collumnName2: collumnName2,
        };

        //console.log("-------------------------source-----------------------");
        //console.log(source);


        // remove colon from titles and add to header



        for (const iterator of specifications) {
            let title = iterator.title;
            let newTitle = title.replace(": ", "");
            iterator.title = newTitle;
            header.push({ id: iterator.title, title: iterator.title });
            header.push({ id: 'spec- ' + iterator.title, title: 'spec- ' + iterator.title });
            source[iterator.title] = iterator.title;
            source['spec- ' + iterator.title] = iterator.value;
            //--add to mainHeader

            (function add(mainHeader, iterator) {

                const found = mainHeader.some(el => el.id === iterator.title);
                // if (!found) console.log("NOT FOUND: ", iterator.title);
                if (!found) mainHeader.push({ id: iterator.title, title: iterator.title });
                if (!found) mainHeader.push({ id: 'spec- ' + iterator.title, title: 'spec- ' + iterator.title });
                return mainHeader;

            })(mainHeader, iterator);
            //-- end of it


        };

        (function add(header, item) {

            const found = header.some(el => el.id === item);
            // if (!found) console.log("NOT FOUND: ", item);
            if (!found) header.push({ id: item, title: item });
            if (!found) source['collumnName3'] = collumnName3;
            return header;

        })(header, collumnName3);

        //--add to mainHeader

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
            header.push({ id: 'etim- ' + iterator.title, title: 'etim- ' + iterator.title });
            source[iterator.title] = iterator.title;
            source['etim- ' + iterator.title] = iterator.value;

            //--add to mainHeader

            (function add(mainHeader, iterator) {

                const found = mainHeader.some(el => el.id === iterator.title);
                // if (!found) console.log("NOT FOUND: ", iterator.title);
                if (!found) mainHeader.push({ id: iterator.title, title: iterator.title });
                if (!found) mainHeader.push({ id: 'etim- ' + iterator.title, title: 'etim- ' + iterator.title });
                return mainHeader;

            })(mainHeader, iterator);
            //-- end of it

        };


        // for (const iterator of variations) {
        //     header.push({ id: iterator.title, title: iterator.title });
        //     header.push({ id: 'variantion ' + iterator.title, title: 'variantion ' + iterator.title });
        //     source[iterator.title] = iterator.title;
        //     source['variantion ' + iterator.title] = iterator.variantionProductNumber;
        //     //--add to mainHeader

        //     (function add(mainHeader, iterator) {

        //         const found = mainHeader.some(el => el.id === iterator.title);
        //         // if (!found) console.log("NOT FOUND: ", iterator.title);
        //         if (!found) mainHeader.push({ id: iterator.title, title: iterator.title });
        //         if (!found) mainHeader.push({ id: 'variantion ' + iterator.title, title: 'variantion ' + iterator.title });
        //         return mainHeader;

        //     })(mainHeader, iterator);
        //     //-- end of it
        // };

        const variationsGroup = []
        for (const prodNr of variations) {
            variationsGroup.push(prodNr.variantionProductNumber);
        }

        const found = mainHeader.some(el => el.id === 'variations');
        // if (!found) console.log("NOT FOUND: ", iterator.title);
        if (!found) mainHeader.push({ id: 'variations', title: 'VARIATIONS' });
        source['variations'] = variationsGroup;

        //--add to mainHeader

        (function add(mainHeader, item) {

            const found = mainHeader.some(el => el.id === item);
            // if (!found) console.log("NOT FOUND: ", item);
            if (!found) mainHeader.push({ id: item, title: item });
            if (!found) header.push({ id: item, title: item });
            return mainHeader;

        })(mainHeader, 'productUrl ');
        //-- end of it
        source['productUrl '] = productUrl;

        //--add to mainHeader

        (function add(mainHeader, item, item2, item3, item4, item5, item6, item7, item8, item9) {

            const found = mainHeader.some(el => el.id === item);
            // if (!found) console.log("NOT FOUND: ", item);
            if (!found) mainHeader.push({ id: item, title: item });

            const found2 = mainHeader.some(el => el.id === item2);
            if (!found2) mainHeader.push({ id: item2, title: item2 });

            const found3 = mainHeader.some(el => el.id === item3);
            if (!found3) mainHeader.push({ id: item3, title: item3 });

            const found4 = mainHeader.some(el => el.id === item4);
            if (!found4) mainHeader.push({ id: item4, title: item4 });

            const found5 = mainHeader.some(el => el.id === item5);
            if (!found5) mainHeader.push({ id: item5, title: item5 });

            const found6 = mainHeader.some(el => el.id === item6);
            if (!found6) mainHeader.push({ id: item6, title: item6 });

            const found7 = mainHeader.some(el => el.id === item7);
            if (!found7) mainHeader.push({ id: item7, title: item7 });

            const found8 = mainHeader.some(el => el.id === item8);
            if (!found8) mainHeader.push({ id: item8, title: item8 });

            const found9 = mainHeader.some(el => el.id === item9);
            if (!found9) mainHeader.push({ id: item9, title: item9 });
            return mainHeader;

        })(mainHeader, 'collumnName4', 'documentstextContent', 'documentsLink', 'documentstextContent1', 
        'documentsLink1', 'documentstextContent2', 'documentsLink2', 'documentstextContent3', 
        'documentsLink3');
        //-- end of it

        // todo add remove those aditions to header its unused at all...

        source['collumnName4'] = collumnName4;
        source['documentstextContent'] = documentstextContent;
        source['documentsLink'] = documentsLink;
        source['documentstextContent1'] = documentstextContent1;
        source['documentsLink1'] = documentsLink1;
        source['documentstextContent2'] = documentstextContent2;
        source['documentsLink2'] = documentsLink2;
        source['documentstextContent3'] = documentstextContent3;
        source['documentsLink3'] = documentsLink3;

        mainSource.push(source);


        const urlsVariants = await page.evaluate(() =>
            Array.from(
                // using selector
                // note returns just those what is in sale, out off sale not added
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

        if (setFileName && category1 !== '') {
            fileName = category1 + " " + category2;
            setFileName = false;
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

            console.log("log.txt file was saved!");
        });

    }

    // for single link

    await scrape(url);
    //scrape variantions
    if (!scrapeOneLevelDeep) {
        for (const varUrl of variantsUrls) {
            await scrape(varUrl);
        }
        scrapeOneLevelDeep = true;
    }


    // for array of links

    //     for (const url of siteLink.productsArray) {
    //         await scrape(url);

    //         //scrape variantions
    //         if (!scrapeOneLevelDeep) {
    //             for (const varUrl of variantsUrls) {
    //                 await scrape(varUrl);
    //             }
    //             scrapeOneLevelDeep = true;
    //         }
    //    }



    //  CREATE NEW CSV DOCUMENT
    const newfileName = fileName.replace(/['"/]+/g, '');

    const csv = createCSV({
        path: `${newfileName}.csv`,
        // path: 'results.csv',
        header: mainHeader
    });

    //  WRITE DATA ROWS
    await csv.writeRecords(
        mainSource

    )
        .then(() => {
            console.log(`Done -> ${newfileName}.csv`);
        });

    //browser.close();
}

// for single link
scrapeProductPage(siteLink.productLink);

// for array of links
// scrapeProductPage(siteLink.productsArray);





