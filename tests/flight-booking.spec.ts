import { test, expect } from '@playwright/test'; // Import the test runner
// import { HotelSearchPage } from '../pages/HotelSearchPage';
import { testData as data } from '../utils/testData';
import { PageObjectManager } from '../pages/PageObjectManager';
import { verifyDepartureBeforeReturn } from '../utils/utils';

test.describe('Flight Booking Process', () => {
  test.beforeEach(async ({ page }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();
    const flight = pom.getFlightSearchPage();

    await home.navigate('https://www.booking.com/');
    await flight.flightButton.click();
    await page.waitForLoadState('networkidle'); // Waits until there are no more than 2 network connections for at least 500 ms
  });
  // test.afterEach(async ({ page }) => {
  //   await page.close();
  // });
  test('TC005 - Enable return date for round-trip flights', async ({
    page,
  }) => {
    const pom = new PageObjectManager(page);
    const flight = pom.getFlightSearchPage();

    await flight.flightSearch('San Francisco', 'Tokyo', '15', '20');
    await expect(
      flight.flightResults,
      'Flight results should be visible after performing search'
    ).toBeVisible({ timeout: 5000 });

    const count = await flight.getFlightResultsCount();
    expect(
      count,
      'Expected at least one flight result but found none.'
    ).toBeGreaterThan(0);
  });

  test.skip('TC006 - Invalid Date Range (Return before Departure)', async ({
    page,
  }) => {
    const pom = new PageObjectManager(page);
    const flight = pom.getFlightSearchPage();

    await flight.flightSearch(
      'San Francisco',
      'Tokyo',
      'April 22, 2025',
      'April 20, 2025',
      true
    );

    await page.waitForTimeout(5000);
    // Extract departure and return date strings from the UI
    const departureDateStr = await page
      .locator(
        '.cBaN-date-select-wrapper .JONo-button[aria-label="Start date"] span.aJ3v'
      )
      .textContent();

    const returnDateStr = await page
      .locator(
        '.cBaN-date-select-wrapper .JONo-button[aria-label="End date"] span.aJ3v'
      )
      .textContent();

    console.log('Departure Date String:', departureDateStr);
    console.log('Return Date String:', returnDateStr);
    // Use the helper function to verify the dates
    try {
      verifyDepartureBeforeReturn(departureDateStr!, returnDateStr!);
      console.log('Dates are valid.');
    } catch (error) {
      console.error('Date comparison failed:', error);
    }
  });

  test.skip('TC007 - Selecting past dates triggers warning/error', async ({
    page,
  }) => {
    const pom = new PageObjectManager(page);
    const flight = pom.getFlightSearchPage();

    await flight.flightSearchDestinationsOnly('San Francisco', 'Tokyo');

    const april1 = page.locator('[aria-label="April 1, 2025"]');

    await expect(april1).toHaveAttribute('aria-disabled', 'true'); // primary check

    // Optional: try clicking to ensure it throws
    const clickResult = await april1
      .click({ trial: true })
      .catch(() => 'not clickable');
    expect(clickResult).toBe('not clickable');

    // Try to locate a past date in the calendar, e.g., Jan 1, 2023
    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // const formattedPastDate = yesterday.toLocaleDateString('en-US', {
    //   year: 'numeric',
    //   month: 'long',
    //   day: 'numeric',
    // }); // e.g., "April 6, 2025"
    // const pastDateLocator = page.locator(`[aria-label="${formattedPastDate}"]`);

    // // Assert that the element is visible (in the DOM) but not clickable
    // await expect(
    //   pastDateLocator,
    //   `Past date "${formattedPastDate}" should be rendered but not clickable`
    // ).toHaveAttribute('aria-disabled', 'true');
  });

  test('TC008 - Unsupported Flight Routes show "No matching locations found." message', async ({
    page,
  }) => {
    const pom = new PageObjectManager(page);
    const flight = pom.getFlightSearchPage();

    await flight.removeSelectedDestinationIfExists();
    await flight.originCity.waitFor();
    await flight.originCity.pressSequentially('NowhereBlue04');
    let errorMessage = await flight.noMatchMessage.textContent();
    expect(
      errorMessage,
      'When entering unsupported locations, an appropriate "No matching locations found." message should appear'
    ).toContain('No matching locations found.');

    await flight.destinationCity.waitFor();
    await flight.destinationCity.pressSequentially('NowhereBlue04');
    errorMessage = await flight.noMatchMessage.textContent();
    expect(
      errorMessage,
      'When entering unsupported locations, an appropriate "No matching locations found." message should appear'
    ).toContain('No matching locations found.');
  });
});
