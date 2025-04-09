import { test, expect } from '@playwright/test'; // Import the test runner
import { testData as data } from '../utils/testData';
import { PageObjectManager } from '../pages/PageObjectManager';

test.describe('Hotel Search Workflow', () => {
  test.beforeEach(async ({ page }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();

    await home.navigate('https://www.booking.com/');
  });

  test('TC009 - Verify hotel details page shows name, location, and rating', async ({
    page,
  }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();
    const hotelDetails = pom.getHotelDetailsPage();

    await home.searchDestination(data.destinations.nyc);
    await home.inputDates(data.dates.checkIn, data.dates.checkOut);
    await home.searchButton.click();
    await home.filterByHotels();
    await page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.hotelFilterPill.waitFor();
    await expect(home.hotelFilterPill).toBeVisible();

    // Click the availability button that opens the new tab
    const [newTab] = await Promise.all([
      // Wait for the new tab to be opened
      page.context().waitForEvent('page'),
      hotelDetails.availability.first().click(), // This click opens the new tab
    ]);

    // Now, `newTab` refers to the newly opened tab
    await newTab.waitForLoadState('domcontentloaded'); // Wait for the new tab to load

    // Perform actions or assertions on the new tab
    const newTabTitle = await newTab.title();
    console.log('New tab title:', newTabTitle);

    //Interacting inside the new tab
    const rating = newTab.locator('[data-testid="rating-stars"]');
    await expect(rating).toBeVisible();

    const stars = await rating.getAttribute('aria-label');
    expect(
      stars,
      'Hotel star rating should follow the "X out of 5 stars" format.'
    ).toMatch(/^\d out of 5 stars$/);

    const hotelName = newTab.locator(
      '[data-capla-component-boundary*="PropertyHeaderName"] h2'
    );
    await expect(hotelName).toBeVisible();

    const nameText = await hotelName.textContent();
    console.log('Hotel name:', nameText);

    const hotelAddress = newTab.locator(
      '[data-capla-component-boundary*="PropertyHeaderAddressDesktop"] button div.a53cbfa6de.f17adf7576'
    );
    await expect(hotelAddress).toBeVisible();
    const addressText = await hotelAddress.textContent();
    console.log('Hotel address:', addressText);

    console.log('Closing Hotel details tab');
    await newTab.close();
  });

  test('TC010 - Verify photo gallery and navigation', async ({ page }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();
    const hotelDetails = pom.getHotelDetailsPage();

    await home.searchDestination(data.destinations.nyc);
    await home.inputDates(data.dates.checkIn, data.dates.checkOut);
    await home.searchButton.click();
    await page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.filterByHotels();
    await page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.hotelFilterPill.waitFor();
    await expect(home.hotelFilterPill).toBeVisible();

    // Click the availability button that opens the new tab
    const [newTab] = await Promise.all([
      // Wait for the new tab to be opened
      page.context().waitForEvent('page'),
      hotelDetails.availability.first().click(), // This click opens the new tab
    ]);

    // Now, `newTab` refers to the newly opened tab
    await newTab.waitForLoadState('domcontentloaded'); // Wait for the new tab to load

    // Use the Page Object Model method to interact with the gallery
    await hotelDetails.openGallery(newTab);

    // Close the new tab after completing the gallery interactions
    await newTab.close();
  });

  test('TC011 - Incomplete Hotel Amenities', async ({ page }) => {
    const pom = new PageObjectManager(page);
    const home = pom.getHotelSearchPage();
    const hotelDetails = pom.getHotelDetailsPage();

    await home.searchDestination(data.destinations.nyc);
    await home.inputDates(data.dates.checkIn, data.dates.checkOut);
    await home.searchButton.click();
    await page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.filterByHotels();
    await page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await home.hotelFilterPill.waitFor();
    await expect(home.hotelFilterPill).toBeVisible();

    // Click the availability button that opens the new tab
    const [newTab] = await Promise.all([
      // Wait for the new tab to be opened
      page.context().waitForEvent('page'),
      hotelDetails.availability.first().click(), // This click opens the new tab
    ]);

    // Now, `newTab` refers to the newly opened tab
    await newTab.waitForLoadState('domcontentloaded'); // Wait for the new tab to load

    // await hotelDetails.checkFacilities(newTab);
    const facilities = await hotelDetails.checkFacilities(newTab);

    // Assert the facilities container is visible
    await expect(
      newTab.locator('.c807d72881.d1a624a1cc.e10711a42e li').first()
    ).toBeVisible({ timeout: 5000 });

    expect(
      facilities.length,
      'Expected at least one facility to be listed'
    ).toBeGreaterThan(0);
    // Close the new tab after completing the gallery interactions
    await newTab.close();
  });
});
