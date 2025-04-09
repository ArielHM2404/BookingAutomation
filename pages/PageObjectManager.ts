import { Page } from '@playwright/test';
// import { HomePage } from './HomePage';
import { HotelSearchPage } from './HotelSearchPage';
import { FlightSearchPage } from './FlightSearchPage';
import { HotelDetailsPage } from './HotelDetailsPage'

export class PageObjectManager {
  private readonly page: Page;

  private hotelSearchPage?: HotelSearchPage;
  private flightSearchPage?: FlightSearchPage;
  private hotelDetailsPage?: HotelDetailsPage;



  constructor(page: Page) {
    this.page = page;
  }

//   getHomePage(): HomePage {
//     if (!this.homePage) {
//       this.homePage = new HomePage(this.page);
//     }
//     return this.homePage;
//   }

  getHotelSearchPage(): HotelSearchPage {
    if (!this.hotelSearchPage) {
      this.hotelSearchPage = new HotelSearchPage(this.page);
    }
    return this.hotelSearchPage;
  }

  getFlightSearchPage(): FlightSearchPage {
    if (!this.flightSearchPage) {
      this.flightSearchPage = new FlightSearchPage(this.page);
    }
    return this.flightSearchPage;
  }

  getHotelDetailsPage(): HotelDetailsPage {
    if (!this.hotelDetailsPage) {
      this.hotelDetailsPage = new HotelDetailsPage(this.page);
    }
    return this.hotelDetailsPage;
  }
}