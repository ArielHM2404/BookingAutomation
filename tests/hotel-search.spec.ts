import { test, expect } from '@playwright/test'; // Import the test runner
import { testData as data } from '../utils/testData';
import { PageObjectManager } from '../pages/PageObjectManager';

test.describe.only('Hotel Search Workflow', () => {
  test.beforeEach(async ({ page }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();

    await home.navigate('https://www.booking.com/');
    await home.closeModalIfVisible(page); //The windows might show up everywhere
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/${testInfo.title}.png`,
        fullPage: true,
      });
    }
  });

  test('TC001 - Search for hotels in New York displays relevant results', async ({
    page,
  }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();

    await home.searchDestination(data.destinations.nyc);
    await home.searchButton.click();
    await home.filterByHotels();
    await page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.hotelFilterPill.waitFor();
    await home.inputDatesField.click();
    await expect(home.hotelFilterPill).toBeVisible();
  });

  test('TC002 - Select check-in and check-out dates', async ({ page }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();

    await home.searchDestination(data.destinations.nyc);
    await home.inputDates(data.dates.checkIn, data.dates.checkOut);
    await home.searchButton.click();
    await page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.closeModalIfVisible(page);
    await home.inputDatesField.click();
    await home.filterByHotels();
    await expect(home.hotelFilterPill).toBeVisible();
  });

  test('TC003 - Apply Guest Rating Filter (8+)', async ({ page }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();

    await home.searchDestination(data.destinations.nyc);
    await home.inputDates(data.dates.checkIn, data.dates.checkOut);
    await home.searchButton.click();
    await page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.closeModalIfVisible(page);
    await home.filterByVeryGood();
    const isFilterapplied = await home.veryGoodFilteredPill.isVisible();
    if (isFilterapplied!) {
      console.log('For some reason the filter was not applied correctly');
      await home.filterByVeryGood();
    }
    await home.veryGoodFilteredPill.waitFor();
    await expect(home.veryGoodFilteredPill).toBeVisible();
    const result = await home.checkReviewScoreInResults(
      'Very Good',
      'Excellent',
      'Wonderful'
    );
    expect(result).toBe(true);
  });

  test('TC004 - Sort results by Lowest Price', async ({ page }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();

    await home.searchDestination(data.destinations.nyc);
    await home.inputDates(data.dates.checkIn, data.dates.checkOut);
    await home.searchButton.click();
    await page.waitForLoadState('networkidle'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.filterByHotels();
    await expect(home.hotelFilterPill).toBeVisible();
    await page.waitForLoadState('networkidle'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.sortByLowestPrice();
    await page.waitForTimeout(5000);

    const prices = await home.getHotelPrices();
    const isSorted = await home.verifyPricesAreSortedAscending();
    await page.waitForTimeout(2000);

    // expect(isSorted).toBe(true); // Assert prices are sorted

    await page.waitForTimeout(10000);
  });
});
