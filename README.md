# Booking.com QA Automation Project

## Description

This project is a test automation framework developed for testing various workflows on Booking.com. The tests aim to validate critical aspects of the booking process, such as hotel and flight search functionality, calendar interactions, and error handling. This framework is built using Playwright and TypeScript to ensure modern, scalable, and efficient automation practices.

Key features include:

- **AI-assisted Test Case Generation**: Structured test cases using AI for better test coverage.
- **Cross-browser Support**: Playwright ensures the tests run on multiple browsers (Chromium, Firefox, and WebKit).
- **Allure Reporting**: Customizable reporting system for better visibility into test results.

## Directory Organization

    /project-root 
    ├── /tests # Contains test cases and test suites  
        ├── hotelSearch.spec.ts │ 
        ├── flightSearch.spec.ts │ 
        └── ... # More test files as needed 
    ├── /pages # Contains page object models │ 
        ├── HotelSearchPage.ts │ 
        ├── FlightSearchPage.ts │ 
        └── ... # More page objects as needed 
    ├── /reports # Contains Allure reports 
    ├── /config # Configuration files for Playwright and testing environment ├── /utils # Utility functions 
    ├── /node_modules # Dependencies 
    ├── package.json # Project dependencies and scripts 
    ├── tsconfig.json # TypeScript configuration 
    └── README.md #

## Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:ArielHM2404/BookingAutomation.git
   cd booking-qa-automation

   ```

2. **Install dependencies:**
   npm install

3. **Install Playwright dependencies:**
   npx playwright install

## Running Test Cases

    npx playwright test

1. **Running specific test files:**
   npx playwright test tests/hotelSearch.spec.ts

## Allure Reporting

**To generate Allure Reports:**
After running the tests, use the following command to generate Allure reports:

    npx allure generate ./reports/allure-results --clean

1. **To view the report:**

You can open the Allure report by running:

    npx allure open
    This will open the generated Allure report in your default browser.
