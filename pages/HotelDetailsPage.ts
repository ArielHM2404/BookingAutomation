import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
export class HotelDetailsPage extends BasePage {
  readonly availability: Locator;
  readonly facilities: Locator;
  readonly hotelGallery: Locator;
  readonly imageButton: Locator;
  readonly galleryWindow: Locator;
  readonly galleryImages: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Self-healing selector using fallback strategy
    this.availability = page.getByTestId('availability-cta');

    this.facilities = page.getByTestId(
      'Property-Header-Nav-Tab-Trigger-facilities'
    );

    this.hotelGallery = page.locator('.k2-hp--gallery-header');

    this.imageButton = page.locator(
      'div.dc5041d860.c72df67c95 > button.a83ed08757.e03b6bd5da'
    );

    this.galleryWindow = page.locator('.bh-photo-modal');

    this.galleryImages = page.locator('.bh-photo-modal-masonry-grid-item');

    this.closeButton = page.locator('button.bui-button--light[title="Close"]');
  }

  async closeModalIfVisible(page: Page) {
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    const closeButton = page.locator('button.bui-button--light[title="Close"]');

    // Check if the close button exists and is visible
    const isVisible = await closeButton.isVisible();

    if (isVisible) {
      console.log('Close button found, clicking...');
      await closeButton.click();
    } else {
      console.log('Close button not found.');
    }
  }

  getDestinationOption(city: string): Locator {
    return this.page.locator('[data-testid="autocomplete-result"]').filter({
      has: this.page.locator('div.a3332d346a', {
        hasText: new RegExp(`^${city}$`, 'i'),
      }),
    });
  }

  // Method to interact with the gallery in the new tab
  async openGallery(newTab: Page) {
    await newTab.waitForTimeout(2000);
    const hotelGallery = newTab.locator('.k2-hp--gallery-header');
    const imageButton = newTab.locator(
      'div.dc5041d860.c72df67c95 > button.a83ed08757.e03b6bd5da'
    );

    await expect(hotelGallery).toBeVisible();
    await expect(hotelGallery).toHaveCount(1);
    await expect(imageButton.first()).toBeVisible();
    await expect(imageButton.first()).toHaveCount(1);
    await newTab.waitForTimeout(2000);
    await imageButton.first().locator('picture').click();
    const galleryWindow = newTab.locator('.bh-photo-modal');
    const galleryImages = newTab.locator('.bh-photo-modal-masonry-grid-item');
    const closeButton = newTab.locator(
      'button.bui-button--light[title="Close"]'
    );

    await expect(galleryWindow).toBeVisible();
    await galleryImages.last().scrollIntoViewIfNeeded();
    await galleryImages.first().scrollIntoViewIfNeeded();
    await closeButton.click();
  }

  async checkFacilities(newTab: Page): Promise<string[]> {
    const mostPopularFacilities = newTab.getByTestId(
      'Property-Header-Nav-Tab-Trigger-facilities'
    );
    await mostPopularFacilities.click();
    await newTab.waitForTimeout(2000);

    const facilities = newTab.locator('.c807d72881.d1a624a1cc.e10711a42e li');
    const count = await facilities.count();
    const facilityNames: string[] = [];

    for (let i = 0; i < count; i++) {
      const item = facilities.nth(i);
      const nameLocator = item.locator('.a53cbfa6de.e6208ee469 .a5a5a75131');
      const name = await nameLocator.textContent();
      facilityNames.push(name?.trim() ?? '');
    }

    console.log(facilityNames);
    return facilityNames;
  }
}
