# 🧪 Fuse QA Take-Home Challenge – Test Case Documentation

This document outlines the structured test cases for the Fuse QA Challenge, covering user stories related to hotel search, filtering, booking workflows, and hotel detail verification on Booking.com. Each test case includes test data and the AI's contribution to the testing process.

---

## ✅ User Story 1: Hotel Search & Filtering

### Test Case 1.1: Search for hotels in "New York"

| ID                  | TC001                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **Description**     | Search for hotels in "New York"                                                            |
| **Steps**           | 1. Open Booking.com<br>2. Enter "New York" in the search bar<br>3. Click the Search button |
| **Expected Result** | Relevant hotels in New York are displayed.                                                 |
| **Test Data**       | City: `"New York"`                                                                         |
| **AI Contribution** | AI helped ensure all major cities with relevant hotels are considered.                     |

---

### Test Case 1.2: Select check-in and check-out dates

| ID                  | TC002                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| **Description**     | Selecting check-in and check-out dates should update hotel availability      |
| **Steps**           | 1. Enter a city<br>2. Select check-in and check-out dates<br>3. Click search |
| **Expected Result** | Hotel availability updates based on selected dates.                          |
| **Test Data**       | City: `"New York"`<br>Check-in: `2025-05-10`<br>Check-out: `2025-05-15`      |
| **AI Contribution** | AI suggested edge cases for selecting unavailable dates.                     |

---

### Test Case 1.3: Apply Guest Rating Filter (8+)

| ID                  | TC003                                                           |
| ------------------- | --------------------------------------------------------------- |
| **Description**     | Apply a "Guest Rating: 8+" filter and check for updated results |
| **Steps**           | 1. Search for hotels<br>2. Apply "Guest Rating: 8+" filter      |
| **Expected Result** | Only hotels with rating 8 or above are displayed.               |
| **Test Data**       | Filter: `"Guest Rating: 8+"`                                    |
| **AI Contribution** | AI identified potential filter combinations and overlap issues. |

---

### Test Case 1.4: Sort results by "Lowest Price"

| ID                  | TC004                                                     |
| ------------------- | --------------------------------------------------------- |
| **Description**     | Sort hotel results by "Lowest Price"                      |
| **Steps**           | 1. Perform a hotel search<br>2. Apply "Lowest Price" sort |
| **Expected Result** | Hotels are reordered by price from lowest to highest.     |
| **Test Data**       | Sort option: `"Lowest Price"`                             |
| **AI Contribution** | AI validated sorting logic and order consistency.         |

---

## ✈️ User Story 2: Flight Booking Process

### Test Case 2.1: Search for a round-trip flight

| ID                  | TC005                                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| **Description**     | Round-trip flight selection enables return date input                        |
| **Steps**           | 1. Open Flights tab<br>2. Select round-trip<br>3. Enter cities and dates     |
| **Expected Result** | Return date input becomes active and required.                               |
| **Test Data**       | Departure: `"San Francisco"`<br>Destination: `"Tokyo"`<br>Type: `Round-trip` |
| **AI Contribution** | AI recommended validations for round-trip enablement logic.                  |

---

### Test Case 2.2: Invalid Date Range (Return before Departure)

| ID                  | TC006                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| **Description**     | Return date before departure date triggers an error                                  |
| **Steps**           | 1. Select a departure date<br>2. Select an earlier return date<br>3. Try to continue |
| **Expected Result** | Error message appears for invalid date logic.                                        |
| **Test Data**       | Departure: `2025-06-01`<br>Return: `2025-05-30`                                      |
| **AI Contribution** | AI identified common user mistakes with date selections.                             |

---

### Test Case 2.3: Select past dates

| ID                  | TC007                                                       |
| ------------------- | ----------------------------------------------------------- |
| **Description**     | Selecting past dates triggers warning/error                 |
| **Steps**           | 1. Attempt to select a past date<br>2. Proceed with search  |
| **Expected Result** | System blocks or warns about invalid dates.                 |
| **Test Data**       | Departure: `2023-01-01`                                     |
| **AI Contribution** | AI flagged past dates as a likely edge case for validation. |

---

### Test Case 2.4: Unsupported Flight Routes

| ID                  | TC008                                                                |
| ------------------- | -------------------------------------------------------------------- |
| **Description**     | Searching an unsupported route shows "No flights found"              |
| **Steps**           | 1. Search for a flight route that’s not served<br>2. Observe results |
| **Expected Result** | "No matching locations found." message appears.                      |
| **Test Data**       | Departure: `"Nowhereville"`<br>Destination: `"Atlantis"`             |
| **AI Contribution** | AI helped simulate exotic/invalid locations for testing fallback UI. |

---

## 🏨 User Story 3: Hotel Details & Amenities Verification

### Test Case 3.1: Verify hotel details page

| ID                  | TC009                                                         |
| ------------------- | ------------------------------------------------------------- |
| **Description**     | Hotel details page shows name, location, rating               |
| **Steps**           | 1. Click hotel from results<br>2. Check details on hotel page |
| **Expected Result** | Hotel name, location, and star rating are visible.            |
| **Test Data**       | Example Hotel: `"The Grand NYC"`                              |
| **AI Contribution** | AI cross-checked data consistency for details page.           |

---

### Test Case 3.2: Verify photo gallery and navigation

| ID                  | TC010                                                        |
| ------------------- | ------------------------------------------------------------ |
| **Description**     | Gallery is present and images are browsable                  |
| **Steps**           | 1. Navigate to hotel page<br>2. Interact with image carousel |
| **Expected Result** | Image navigation works smoothly without errors.              |
| **Test Data**       | Image count: `5+` images                                     |
| **AI Contribution** | AI proposed testing for broken images and transitions.       |

---


### Test Case 3.3: Incomplete Hotel Amenities

| ID                  | TC011                                                               |
| ------------------- | ------------------------------------------------------------------- |
| **Description**     | Missing amenities handled cleanly                                   |
| **Steps**           | 1. Load hotel with partial amenity data<br>2. Review amenity list   |
| **Expected Result** | Missing values do not break layout; rest load as expected.          |
| **Test Data**       | Hotel ID: `missing-amenities-hotel-003`<br>Missing: `Wi-Fi`, `Pool` |
| **AI Contribution** | AI proposed schema validation to detect missing feature sets.       |

---

This file now includes both **standard test cases** and **edge cases** to cover a broader range of potential issues.
