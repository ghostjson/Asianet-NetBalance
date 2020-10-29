const puppeteer = require("puppeteer");
const config = require("./config.json");

async function run() {
  let url = "https://myabb.in/";

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  await page.type("#DUser", config.username, { delay: config.buffer_delay });
  await page.type("#Pwd", config.password, { delay: config.buffer_delay });

  await page.click(".btn.waves-effect.waves-light", { delay: 1000 });

  await page.waitForNavigation({ waitUntil: "networkidle0" });

  const usage_page = await browser.newPage();
  await usage_page.goto(`${url}/goToForm?formId=CUP001`, {
    waitUntil: "networkidle0",
  });

  const remaining = await getRemainingData(usage_page);
  const used = await getUsedData(usage_page);
  const total = await getTotalData(usage_page);
  console.log("action called....");
  console.log(`Total: ${toGB(total)}GB`);
  console.log(`Used: ${toGB(used)}GB`);
  console.log(`Remaining: ${toGB(remaining)}GB`);

  await browser.close();
}

async function getRemainingData(page) {
  return await page.evaluate(() => {
    return getValue("#totalOctets");
  });
}

async function getUsedData(page) {
  return await page.evaluate(() => {
    return getValue("#totalOctet");
  });
}

async function getTotalData(page) {
  return await page.evaluate(() => {
    return getValue("#totalOc");
  });
}

function toGB(mb) {
  return (mb / 1024).toFixed(2);
}

function getValue(id){
  return document.querySelector(id).innerText;
}

run();
