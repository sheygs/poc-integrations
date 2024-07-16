const puppeteer = require('puppeteer');

(async function runScraper() {
        // launch a browser
        const browser = await puppeteer.launch({ headless: 'new' });

        // initialize a page
        const page = await browser.newPage();

        // go to a specific page
        await page.goto('https://www.jumia.com.ng/');

        // set a delay of 10s to allow the page to load
        // await new Promise((r) => setTimeout(r, 10000));

        // await page.screenshot({ path: './amazon.jpeg', fullPage: true });
        await page.pdf({ path: './jumia.pdf', format: 'A4' });

        const html = await page.content();

        console.log({ html });

        // close browser
        await browser.close();
})();
