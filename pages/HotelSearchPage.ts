import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { testData as data } from '../utils/testData';
import { waitForElementToBeVisible } from '../utils/utils';

export class HotelSearchPage extends BasePage {
  readonly destinationInput: Locator;
  readonly searchButton: Locator;
  readonly ratingFilter: Locator;
  readonly sortByPriceButton: Locator;
  readonly inputDatesField: Locator;
  readonly hotelsFilterPill: Locator;
  readonly calendar: Locator;
  readonly wonderfulFilter: Locator;
  readonly wonderfulFilteredPill: Locator;
  readonly propertyCards: Locator;
  readonly reviewScoreLocator: Locator;
  readonly veryGoodFilter: Locator;
  readonly veryGoodFilteredPill: Locator;
  readonly sorter: Locator;
  readonly sortLowToHigh: Locator;
  readonly cardsPrice: Locator;

  constructor(page: Page) {
    super(page);

    // Self-healing selector using fallback strategy
    this.destinationInput = page.locator(
      'input[name="ss"], input[placeholder*="destin"], input[aria-label*="destin"]'
    );

    this.cardsPrice = page.locator(
      '[data-testid="price-and-discounted-price"]'
    );
    this.sortLowToHigh = page.locator(
      'button[aria-label="Price (lowest first)"]'
    );
    this.sorter = page.getByTestId('sorters-dropdown-trigger');

    this.propertyCards = page.locator('div[data-testid="property-card"]');

    this.veryGoodFilter = page.locator(
      'input[name="review_score=80"][aria-label^="Very Good: 8+:"]'
    );

    this.reviewScoreLocator = page.locator('div[data-testid="review-score"]');

    this.calendar = page.locator(
      '[data-testid="searchbox-datepicker-calendar"]'
    );

    this.veryGoodFilteredPill = page.getByTestId('filter:review_score=80');
    this.wonderfulFilter = page.locator(
      '[aria-label="Wonderful: 9+: 281 properties"]'
    );

    this.wonderfulFilteredPill = page.locator(
      '[data-testid="filter:review_score=90"]'
    );

    this.searchButton = page.locator('button[type="submit"]');

    this.ratingFilter = page.locator(
      'input[name="ss"], input[placeholder*="destin"], input[aria-label*="destin"]'
    );

    this.sortByPriceButton = page.locator(
      'input[name="ss"], input[placeholder*="destin"], input[aria-label*="destin"]'
    );

    this.inputDatesField = page.getByTestId('searchbox-dates-container');

    this.hotelsFilterPill = page.locator(
      'button[data-testid="filter:ht_id=204"]'
    );
  }

  getDestinationOption(city: string): Locator {
    return this.page.locator('[data-testid="autocomplete-result"]').filter({
      has: this.page.locator('div.a3332d346a', {
        hasText: new RegExp(`^${city}$`, 'i'),
      }),
    });
  }

  async searchDestination(destination: string) {
    await this.closeModalIfVisible(this.page);
    await this.destinationInput.pressSequentially(destination);
    const optionLocator = this.getDestinationOption(destination);
    await waitForElementToBeVisible(this.page, optionLocator);
    await optionLocator.click();

    //Closing calendar
    await this.inputDatesField.click();
  }

  /**
   * Selects a date from the calendar using the data-date attribute.
   * @param dateStr - Format: 'YYYY-MM-DD'
   */
  async selectDate(dateStr: string) {
    const dateLocator = this.page.locator(`[data-date="${dateStr}"]`);
    await dateLocator.scrollIntoViewIfNeeded();
    await dateLocator.waitFor({ state: 'visible' });
    await dateLocator.click();
  }

  async inputDates(checkInDate: string, checkOutDate: string) {
    await this.inputDatesField.click();

    await waitForElementToBeVisible(this.page, this.calendar);

    // Select the check-in date
    await this.selectDate(checkInDate);

    // Select the check-out date
    await this.selectDate(checkOutDate);
  }

  async filterByHotels() {
    await this.closeModalIfVisible(this.page);
    const hotelFilterCheckbox = this.page
      .locator('input[name="ht_id=204"][aria-label^="Hotels"]')
      .first();
    await hotelFilterCheckbox.waitFor();
    await expect(hotelFilterCheckbox).toBeVisible();
    const isChecked = await hotelFilterCheckbox.isChecked();
    if (!isChecked) {
      await this.closeModalIfVisible(this.page);
      await hotelFilterCheckbox.check();
    }
  }

  async filterByVeryGood() {
    await this.closeModalIfVisible(this.page);
    const veryGoodFilter = this.veryGoodFilter.first();
    await veryGoodFilter.waitFor();
    await expect(veryGoodFilter).toBeVisible();
    const isChecked = await veryGoodFilter.isChecked();
    if (!isChecked) {
      await this.page.waitForTimeout(3000);
      await veryGoodFilter.scrollIntoViewIfNeeded();
      await this.closeModalIfVisible(this.page);
      await veryGoodFilter.check();
    }
  }

  get hotelFilterPill() {
    return this.hotelsFilterPill;
  }

  get wonderfulFilterPill() {
    return this.wonderfulFilteredPill;
  }

  async filterByWonderful9Plus() {
    await this.wonderfulFilter.waitFor();
    const wonderfulCheckbox = this.wonderfulFilter;

    // Check if the checkbox is already checked
    const isChecked = await wonderfulCheckbox?.isChecked();

    // If it's not checked, click it to select
    if (!isChecked) {
      await wonderfulCheckbox?.click();
    }
  }

  async checkReviewScoreInResults(
    reviewScoreText1: string,
    reviewScoreText2: string,
    reviewScoreText3: string
  ): Promise<boolean> {
    const propertyCards = this.page.locator('div[data-testid="property-card"]');
    const totalCards = await propertyCards.count();
    console.log(`Total number of property cards: ${totalCards}`);

    if (totalCards === 0) {
      console.log('No property cards found.');
      return false;
    }

    const scoreOptions = [reviewScoreText1, reviewScoreText2, reviewScoreText3];

    for (let i = 0; i < totalCards; i++) {
      const card = propertyCards.nth(i);

      for (const score of scoreOptions) {
        const scoreLocator = card
          .locator(`div[data-testid="review-score"] div:has-text("${score}")`)
          .first();

        try {
          console.log(
            `Checking for review score: "${score}" in card #${i + 1}`
          );
          await expect(scoreLocator).toBeVisible();
          console.log(
            `✅ Found matching review score "${score}" in card #${i + 1}`
          );
          return true; // 🎯 Found one match — we're done!
        } catch {
          // Continue to next score option
        }
      }
    }

    console.log('❌ No matching review scores found in any card.');
    return false; // No matches in any card
  }

  // Function to check if "Wonderful" text is visible in each property card's review score
  async checkWonderfulInResults(): Promise<void> {
    const propertyCards = this.propertyCards; // Locator for all property cards

    // Loop through each property card and check for the "Wonderful" text
    for (let i = 0; i < (await propertyCards.count()); i++) {
      const card = propertyCards.nth(i);
      const wonderfulText = card.locator(
        `${this.reviewScoreLocator} div:has-text("Wonderful")`
      );
      await expect(wonderfulText).toBeVisible(); // Assert that "Wonderful" is visible in the review score
    }
  }

  async sortByLowestPrice() {
    await this.sorter.click();
    await this.sortLowToHigh.click();
  }

  async getHotelPrices(): Promise<number[]> {
    const priceElements = await this.page.$$(
      '[data-testid="price-and-discounted-price"]'
    );
    const prices = [];

    for (const element of priceElements) {
      const priceText = await element.innerText();

      // Strip out any non-numeric characters (e.g., currency symbols)
      const numericPrice = parseFloat(priceText.replace(/[^\d.-]/g, ''));

      // Add the numeric price to the array
      prices.push(numericPrice);
    }

    return prices;
  }

  async verifyPricesAreSortedAscending(): Promise<boolean> {
    const prices = await this.getHotelPrices();

    // Log the prices for debugging purposes
    console.log('Prices:', prices);

    // Check if the array is sorted in ascending order
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] > prices[i + 1]) {
        console.log(
          `Prices are not sorted! Found: ${prices[i]} > ${prices[i + 1]}`
        );
        return false; // Found an unsorted pair
      }
    }

    return true; // Prices are sorted
  }
}
