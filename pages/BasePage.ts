import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.closeButton = page.locator('button.bui-button--light[title="Close"]');
  }

  async closeModalIfVisible(page: Page) {
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await this.page.waitForTimeout(4000);
    // const closeButton = page.locator('button.bui-button--light[title="Close"]');
    // const closeButton = page.locator('button[aria-label="Close"]');
    const closeButton = page.locator(
      'button[aria-label="Dismiss sign-in info."]'
    );

    // Check if the close button exists and is visible
    const isVisible = await closeButton.isVisible();

    if (isVisible) {
      console.log('Close button found, clicking...');
      await closeButton.scrollIntoViewIfNeeded();
      await closeButton.click({ force: true });
    } else {
      console.log('Close button not found.');
    }
  }

  async navigate(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded'); // Waits until there are no more than 2 network connections for at least 500 ms
  }

  async waitForSeconds(seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
  }
}
