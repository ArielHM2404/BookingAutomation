import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FlightSearchPage extends BasePage {
  readonly destinationInput: Locator;
  readonly flightButton: Locator;
  readonly roundTrip: Locator;
  readonly originCity: Locator;
  readonly originCityDropdown: Locator;
  readonly destinationCity: Locator;
  readonly destinationCityDropdown: Locator;
  readonly flightSearchButton: Locator;
  readonly flightResults: Locator;
  readonly noMatchMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Self-healing selector using fallback strategy
    this.destinationInput = page.locator(
      'input[name="ss"], input[placeholder*="destin"], input[aria-label*="destin"]'
    );

    this.noMatchMessage = page.locator('.c2u5p-error');
    this.flightResults = page.locator('.Fxw9');
    this.flightSearchButton = page.locator(
      'button[role="button"][aria-label="Search"]'
    );

    this.flightButton = page.getByRole('link', { name: 'Flights' });

    this.roundTrip = page.getByRole('radio', { name: 'Round-trip' });

    this.originCity = page.getByLabel('Flight origin input');

    this.originCityDropdown = page
      .locator('[role="listbox"] >> [role="option"]')
      .first();

    this.destinationCity = page.getByLabel('Flight destination input');

    this.destinationCityDropdown = page
      .locator('#flight-destination-smarty-input-list li[role="option"]')
      .first();
  }

  async removeSelectedDestinationIfExists() {
    await this.page.waitForTimeout(2000);
    const selectedItem = this.page.locator('.c_neb-item');
    if (await selectedItem.isVisible()) {
      await selectedItem.locator('.c_neb-item-button[role="button"]').click();
    }
  }
  async flightSearchDestinationsOnly(
    originCity: string,
    destinationCity: string
  ) {
    await this.removeSelectedDestinationIfExists();
    await this.originCity.click({ force: true });

    await this.originCity.pressSequentially(originCity);
    await this.page.waitForLoadState('networkidle'); // Waits until there are no more than 2 network connections for at least 500 ms
    await this.page.waitForSelector('#flight-origin-smarty-input-list');

    // Wait for the first option to be visible (you can target the first <li> element)
    const firstOption = this.page.locator(
      '#flight-origin-smarty-input-list li[role="option"]:first-child'
    );

    // Wait until the first option is visible
    await firstOption.waitFor({ state: 'visible' });

    // Click on the first option
    await firstOption.click();
    await this.destinationCity.pressSequentially(destinationCity);
    await this.destinationCityDropdown.click();
  }

  async flightSearch(
    originCity: string,
    destinationCity: string,
    departureDate: string,
    returnDate: string,
    invalidDate = false
  ) {
    await this.removeSelectedDestinationIfExists();
    await this.originCity.waitFor();
    await this.originCity.pressSequentially(originCity);
    await this.page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
    await this.page.waitForSelector('#flight-origin-smarty-input-list');

    // Wait for the first option to be visible (you can target the first <li> element)
    const firstOption = this.page.locator(
      '#flight-origin-smarty-input-list li[role="option"]:first-child'
    );

    // Wait until the first option is visible
    await firstOption.waitFor({ state: 'visible' });

    // Click on the first option
    await firstOption.click();
    await this.destinationCity.pressSequentially(destinationCity);
    await this.destinationCityDropdown.click();

    if (!invalidDate) {
      await this.selectDates(
        this.page,
        'April 2025',
        departureDate,
        'April 2025',
        returnDate
      );
    } else {
      await this.selectInvalidDates(this.page, departureDate, returnDate);
    }
  }

  async selectDates(
    page: Page,
    departureMonth: string,
    departureDay: string,
    returnMonth: string,
    returnDay: string
  ) {
    const nextMonthButton = page.locator('div[aria-label="Next Month"]');

    // Helper: navigate to month by checking visible ones and clicking next if needed
    const navigateToMonth = async (monthName: string) => {
      for (let i = 0; i < 12; i++) {
        await page
          .locator('.or3C.or3C-wrapper')
          .first()
          .waitFor({ state: 'visible' });

        const visibleMonths = await page
          .locator('.or3C.or3C-wrapper caption')
          .allTextContents(); // Look for the caption containing the month name

        console.log('Visible months:', visibleMonths);

        if (
          visibleMonths.some((text) =>
            text.toLowerCase().includes(monthName.toLowerCase())
          )
        ) {
          return; // Month found
        }

        await nextMonthButton.click();
        await page.waitForTimeout(500);
      }

      throw new Error(`Month "${monthName}" not found after 12 attempts.`);
    };

    // Helper: select a day (forces click on first match for robustness)
    const selectDay = async (day: string) => {
      const dayLocator = page.locator(
        `.or3C.or3C-wrapper [aria-label*="${day},"]`
      ); // Select day based on the "aria-label" attribute
      await dayLocator.first().waitFor({ state: 'visible' });
      await dayLocator.first().click({ force: true });
    };

    // Open departure calendar
    const departureBtn = page.locator('div[aria-label="Departure"]');
    await departureBtn.waitFor({ state: 'visible' });
    await departureBtn.click();

    await navigateToMonth(departureMonth);
    await selectDay(departureDay);

    // Open return calendar
    const returnBtn = page.locator('div[aria-label="Return"]');
    await returnBtn.waitFor({ state: 'visible' });
    await returnBtn.click();

    await navigateToMonth(returnMonth);
    await selectDay(returnDay);

    // Optionally close overlay if it's still open
    const overlayCloseBtn = page.locator('.voEJ-top-controls');
    if (await overlayCloseBtn.isVisible()) {
      await overlayCloseBtn.click();
    }

    // Submit search
    await this.flightSearchButton.click();
  }

  async selectInvalidDates(
    page: Page,
    departureDate: string,
    returnDate: string
  ) {
    const departureBtn = page.locator('div[aria-label="Departure"]');
    const returnBtn = page.locator('div[aria-label="Return"]');

    const selectDate = async (dateLabel: string) => {
      const dateLocator = page.locator(`div[aria-label="${dateLabel}"]`);
      await dateLocator.waitFor({ state: 'visible' });
      await dateLocator.click({ force: true });
    };

    // Open departure calendar and select departure date
    await departureBtn.waitFor({ state: 'visible' });
    await departureBtn.click();
    await selectDate(departureDate);

    // Open return calendar and select return date
    await returnBtn.waitFor({ state: 'visible' });
    await returnBtn.click();
    await selectDate(returnDate);

    // Close calendar overlay (if needed) by clicking outside or a close control
    const overlayCloseBtn = page.locator('.voEJ-top-controls');
    if (await overlayCloseBtn.isVisible()) {
      await overlayCloseBtn.click();
    }

    // Click the search button to proceed
    await this.flightSearchButton.click();
  }

  async getFlightResultsCount(): Promise<number> {
    const results = this.flightResults.locator('div[role="group"]');
    const count = await results.count();
    console.log(`Found ${count} flight result(s)`);
    return count;
  }
}
