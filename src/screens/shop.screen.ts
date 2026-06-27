import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'

export class ShopScreen extends BaseScreen {
  private get productsCounter(): ChainablePromiseElement {
    return $('android=new UiSelector().descriptionContains("Showing")')
  }

  private get allCategoryChip(): ChainablePromiseElement {
    return $('~All')
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.productsCounter.waitForDisplayed({ timeout: timeoutMs })
    await this.allCategoryChip.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    const counterVisible = await this.productsCounter
      .isDisplayed()
      .catch(() => false)
    const allChipVisible = await this.allCategoryChip
      .isDisplayed()
      .catch(() => false)
    return counterVisible && allChipVisible
  }

  async getProductsCounterText(): Promise<string> {
    await this.productsCounter.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.productsCounter.getAttribute('content-desc')) ?? ''
    return desc.replace(/\s+/gu, ' ').trim()
  }
}
