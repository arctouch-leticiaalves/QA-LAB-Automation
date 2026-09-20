export const SWIPEABLE_CAROUSEL_LOCATORS = {
  backButton: '~Back',

  swipeableCarouselTitle:
    'android=new UiSelector().description("Swipeable Carousel").clickable(false)',

  instructionalHint:
    'android=new UiSelector().descriptionContains("Instructional hint")',

  pageCounter: (page: number) =>
    `android=new UiSelector().descriptionContains("Page ${page} of 4")`,

  /** Currently visible carousel page content area (any page) */
  carouselContent:
    'android=new UiSelector().descriptionContains("Carousel page")',

  welcomePage:
    'android=new UiSelector().descriptionContains("Carousel page 1: Welcome")',

  featuresPage:
    'android=new UiSelector().descriptionContains("Carousel page 2: Features")',

  performancePage:
    'android=new UiSelector().descriptionContains("Carousel page 3: Performance")',

  finishPage:
    'android=new UiSelector().descriptionContains("Carousel page 4: Finish")',

  carouselPage: (page: number, title: string) =>
    `android=new UiSelector().descriptionContains("Carousel page ${page}: ${title}")`,

  pageIndicator: (page: number) =>
    `android=new UiSelector().description("Page indicator ${page}")`,

  activePageIndicator: (page: number) =>
    `android=new UiSelector().descriptionContains("Page indicator ${page}, active")`,

  /** Matches all dot indicators at the bottom of the carousel */
  pageIndicators:
    'android=new UiSelector().descriptionContains("Page indicator")',
} as const
