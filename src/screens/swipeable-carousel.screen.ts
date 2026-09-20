import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { SWIPEABLE_CAROUSEL_LOCATORS } from '../locators/swipeable-carousel.locators'

const PAGE_LOCATORS: Record<string, string> = {
  Welcome: SWIPEABLE_CAROUSEL_LOCATORS.welcomePage,
  Features: SWIPEABLE_CAROUSEL_LOCATORS.featuresPage,
  Performance: SWIPEABLE_CAROUSEL_LOCATORS.performancePage,
  Finish: SWIPEABLE_CAROUSEL_LOCATORS.finishPage,
}

const TOTAL_PAGES = 4

export class SwipeableCarouselScreen extends BaseScreen {
  private get swipeableCarouselTitle(): ChainablePromiseElement {
    return $(SWIPEABLE_CAROUSEL_LOCATORS.swipeableCarouselTitle)
  }

  private get carouselContent(): ChainablePromiseElement {
    return $(SWIPEABLE_CAROUSEL_LOCATORS.carouselContent)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.swipeableCarouselTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.carouselContent.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.swipeableCarouselTitle.isDisplayed().catch(() => false)
  }

  getExpectedPageCount(): number {
    return TOTAL_PAGES
  }

  async isPageDisplayed(page: number): Promise<boolean> {
    return $(SWIPEABLE_CAROUSEL_LOCATORS.pageCounter(page))
      .isDisplayed()
      .catch(() => false)
  }

  async isCarouselPageVisible(pageTitle: string): Promise<boolean> {
    const locator = PAGE_LOCATORS[pageTitle]
    if (!locator) return false
    return $(locator).isDisplayed().catch(() => false)
  }

  async isActiveIndicator(page: number): Promise<boolean> {
    return $(SWIPEABLE_CAROUSEL_LOCATORS.activePageIndicator(page))
      .isDisplayed()
      .catch(() => false)
  }

  async swipeLeft(): Promise<void> {
    await this.swipeCarousel('left')
  }

  async swipeRight(): Promise<void> {
    await this.swipeCarousel('right')
  }

  async swipeLeftTimes(times: number): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.swipeLeft()
    }
  }

  private async swipeCarousel(direction: 'left' | 'right'): Promise<void> {
    await this.waitFor(this.carouselContent, 5_000)
    const { x, y } = await this.carouselContent.getLocation()
    const { width, height } = await this.carouselContent.getSize()

    await driver.execute('mobile: swipeGesture', {
      left: x + 80,
      top: y,
      width: width - 160,
      height,
      direction,
      percent: 0.85,
    })
    await browser.pause(400)
  }
}
