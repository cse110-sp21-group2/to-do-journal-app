// const { expect } = require("chai");

// describe('Basic user flow for SPA ', () => {
//     beforeAll(async () => {
//       await page.goto('http://127.0.0.1:5501/source/client/views/monthly.html');
//       await page.waitForTimeout(500);
// });
  
// it('Test1: Goes to initial page', async() => {
//     const month = await page.$$eval("month-label");
//     expect(month).toBe("June");
// });

// it('Test2: ')


// it('Test3: Clicking the next button, user should go to July', async() => {
//     await page.click(body > div.page-heading > div.forward-button);

//     const month = await page.$$eval("month-label");

//     expect(month.includes("July")).toBe(true);
//   });

// it('Test4: In the month of July, dates are correct', async() => {
//     const dates = document.getElementsByClassName('date-number');

//     // Checks the first and last days to see if next month is correct
//     expect dates[4].toBe(1);
//     expect dates[35].toBe(31);
// })

// it('Test5: Clicking the next button, user should go to August', async() => {
//     await page.click(body > div.page-heading > div.forward-button);

//     const month = await page.$$eval("month-label");

//     expect(month.includes("August")).toBe(true);
//   });

// it('Test6: In the month of August, dates are correct', async() => {
//     let dates = document.getElementsByClassName('date-number');

//     // Checks the first and last days to see if next month is correct
//     expect dates[0].toBe(1);
//     expect dates[27].toBe(31);
// });

// it('Test7: Clicking the next button enough times to get to next year', async() => {
//     await page.click(body > div.page-heading > div.forward-button);
//     await page.click(body > div.page-heading > div.forward-button);
//     await page.click(body > div.page-heading > div.forward-button);
//     await page.click(body > div.page-heading > div.forward-button);
//     await page.click(body > div.page-heading > div.forward-button);

//     const month = await page.$$eval("month-label");

//     expect(month.includes("January")).toBe(true);
//     expect(month.includes("2022")).toBe(true);
//   });

// it('Test8: In the month of January, dates are correct', async() => {
//     let dates = document.getElementsByClassName('date-number');

//     // Checks the first and last days to see if next month is correct
//     expect dates[6].toBe(1);
//     expect dates[32].toBe(31);
// });

// it('Test9: Clicking the back button, user should go to December of last year', async() => {
//     await page.click(body > div.page-heading > div.back-button);

//     const month = await page.$$eval("month-label");

//     expect(month.includes("December")).toBe(true);
//     expect(month.includes("2021")).toBe(true);
//   });

// it('Test10: In the month of January, dates are correct', async() => {
//     let dates = document.getElementsByClassName('date-number');

//     // Checks the first and last days to see if next month is correct
//     expect dates[3].toBe(1);
//     expect dates[33].toBe(31);
// });

// it('Test11: Clicking the refresh button, user should go back to current month', async() => {
//     await page.click(body > div.page-heading > div.back-button);

//     const month = await page.$$eval("month-label");

//     expect(month.includes("December")).toBe(true);
//     expect(month.includes("2021")).toBe(true);
//   });

// });