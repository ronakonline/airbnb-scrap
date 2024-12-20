import puppeteer from "puppeteer";
// Or import puppeteer from 'puppeteer-core';

// Variables
const location = "Delhi";
const checkin = "2025-01-07";
const checkout = "2025-01-08";
const adults = 1;
const monthlyStartDate = "2025-01-01";
const monthlyEndDate = "2025-04-01";
const monthlyLength = 3;
const channel = "EXPLORE";
const flexibleTripLength = "one_week";

// Base URL
const baseURL = "https://www.airbnb.co.in/s/";

// Construct the URL
const url = new URL(`${baseURL}${location}/homes`);
url.searchParams.append("refinement_paths[]", "/homes");
url.searchParams.append("flexible_trip_lengths[]", flexibleTripLength);
url.searchParams.append("monthly_start_date", monthlyStartDate);
url.searchParams.append("monthly_length", monthlyLength);
url.searchParams.append("monthly_end_date", monthlyEndDate);
url.searchParams.append("price_filter_input_type", "0");
url.searchParams.append("channel", channel);
url.searchParams.append("query", location);
url.searchParams.append("date_picker_type", "calendar");
url.searchParams.append("checkin", checkin);
url.searchParams.append("checkout", checkout);
url.searchParams.append("adults", adults);
url.searchParams.append("source", "structured_search_input_header");
url.searchParams.append("search_type", "autocomplete_click");

// Output the URL
console.log(url.toString());

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({
  headless: false,
});
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto(url);

await page.setViewport({ width: 1680, height: 941 });

var room_found = false;
var pagination_completed = false;
var ListingPage = 1;
var room_id = "1223010704799598866";
//var room_id = "1306633673324216777";

while (!pagination_completed) {
  await page.waitForNetworkIdle();
  const targetElement = await page.$(`a[target="listing_${room_id}"]`);

  if (targetElement) {
    console.log("Element found!");
    // await page.evaluate((el) => {
    //   el.style.border = "2px solid red";
    // }, targetElement);
    // const dimensions = await page.evaluate(() => ({
    //   width: document.documentElement.scrollWidth,
    //   height: document.documentElement.scrollHeight,
    // }));

    // console.log("dimensions", dimensions);
    // await page.setViewport({
    //   width: dimensions.width,
    //   height: dimensions.height,
    // });
    // Optionally, perform an action like clicking on the element
    //await page.waitForTimeout(3000);
    await page.screenshot({
      path: "hn.png",
      fullPage: false,
    });

    room_found = true;
    pagination_completed = true;
  } else {
    console.log(`Element not found on page ${ListingPage}!`);
    console.log("Going to page ", ListingPage + 1);
    ListingPage += 1;

    //navigate to next page
    try {
      // Locate the <nav> element with aria-label="Search results pagination"
      const navElement = await page.$(
        'nav[aria-label="Search results pagination"]',
      );
      if (navElement) {
        console.log("Pagination navigation found!");

        // Look for the <a aria-label="Next"> tag within the <nav>
        const nextButton = await navElement.$('a[aria-label="Next"]');

        if (nextButton) {
          console.log("Next button found! Clicking...");
          // Click on the "Next" button
          await nextButton.click();
        } else {
          console.log(
            "Next button not found within the pagination navigation.",
          );
          pagination_completed = true;
        }
      } else {
        console.log("Pagination navigation not found.");
        pagination_completed = true;
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

if (room_found) {
  console.log("Room found on page ", ListingPage);
}

console.log("done");
// // Set screen size.
// await page.setViewport({width: 1080, height: 1024});

// // Type into search box.
// await page.locator('.devsite-search-field').fill('automate beyond recorder');

// // Wait and click on first result.
// await page.locator('.devsite-result-item-link').click();

// // Locate the full title with a unique string.
// const textSelector = await page
//   .locator('text/Customize and automate')
//   .waitHandle();
// const fullTitle = await textSelector?.evaluate(el => el.textContent);

// // Print the full title.
// console.log('The title of this blog post is "%s".', fullTitle);

//await browser.close();
