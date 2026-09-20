import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { STAR_RATING_LOCATORS } from '../locators/star-rating.locators'

export class StarRatingScreen extends BaseScreen {
  private get starRatingTitle(): ChainablePromiseElement {
    return $(STAR_RATING_LOCATORS.starRatingTitle)
  }

  private get submitRatingButton(): ChainablePromiseElement {
    return $(STAR_RATING_LOCATORS.submitRatingButton)
  }

  private get resetRatingButton(): ChainablePromiseElement {
    return $(STAR_RATING_LOCATORS.resetRatingButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.starRatingTitle.waitForDisplayed({ timeout: timeoutMs })
    await $(STAR_RATING_LOCATORS.ratingValue(0)).waitForDisplayed({
      timeout: timeoutMs,
    })
    await $(STAR_RATING_LOCATORS.rateStars(1)).waitForDisplayed({
      timeout: timeoutMs,
    })
  }

  async isLoaded(): Promise<boolean> {
    return this.starRatingTitle.isDisplayed().catch(() => false)
  }

  async getCurrentRating(): Promise<number> {
    for (let value = 0; value <= 5; value++) {
      const visible = await $(STAR_RATING_LOCATORS.ratingValue(value))
        .isDisplayed()
        .catch(() => false)
      if (visible) {
        return value
      }
    }
    throw new Error('Could not determine current star rating')
  }

  async rate(value: number): Promise<void> {
    const star = $(STAR_RATING_LOCATORS.rateStars(value))
    await this.waitFor(star, 5_000)
    await star.click()
    await $(STAR_RATING_LOCATORS.ratingValue(value)).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async submitRating(): Promise<void> {
    await this.waitFor(this.submitRatingButton, 5_000)
    await this.submitRatingButton.click()
  }

  async isRatingSubmitted(value: number): Promise<boolean> {
    return $(STAR_RATING_LOCATORS.ratingSubmitted(value))
      .isDisplayed()
      .catch(() => false)
  }

  async isResetDisplayed(): Promise<boolean> {
    return this.resetRatingButton.isDisplayed().catch(() => false)
  }
}
