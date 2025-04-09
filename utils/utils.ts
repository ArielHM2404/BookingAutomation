import { Page, Locator } from '@playwright/test';

// Wait for an element to become visible
export async function waitForElementToBeVisible(
  page: Page,
  locator: Locator,
  timeout: number = 15000
): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
}

export async function extractDates(page: Page) {
  // Extract departure date
  const departureDateString = await page
    .locator('span.aJ3v')
    .first()
    .textContent();
  // Extract return date
  const returnDateString = await page.locator('span.aJ3v').nth(1).textContent();

  if (!departureDateString || !returnDateString) {
    throw new Error('Could not extract dates');
  }

  // Parse the dates (you can use a library like moment.js, or native Date parsing)
  const departureDate = new Date(
    departureDateString.replace(/^(\w{3}) (\d{1,2})/, '$2 $1')
  );
  const returnDate = new Date(
    returnDateString.replace(/^(\w{3}) (\d{1,2})/, '$2 $1')
  );

  return { departureDate, returnDate };
}

// Function to parse date strings like 'Thu 5/1' into valid Date objects
export function parseDate(dateStr: string): Date {
  const [weekday, monthDay] = dateStr.split(' '); // Split to get "Thu" and "5/1"
  const currentYear = new Date().getFullYear(); // Get the current year
  const formattedDate = `${monthDay}/${currentYear}`; // Format it to MM/DD/YYYY
  return new Date(formattedDate); // Return the Date object
}

// Function to compare if departure date is before return date
export function verifyDepartureBeforeReturn(
  departureDateStr: string,
  returnDateStr: string
): void {
  // Parse the dates from string to Date objects
  const departureDate = parseDate(departureDateStr);
  const returnDate = parseDate(returnDateStr);

  // Check if the dates are valid
  if (isNaN(departureDate.getTime()) || isNaN(returnDate.getTime())) {
    throw new Error(
      'Invalid date format: Unable to parse the dates correctly.'
    );
  }

  // Assert that the departure date is before the return date
  if (departureDate >= returnDate) {
    throw new Error('Departure date should be before return date');
  }
}
