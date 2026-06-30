import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { SHOP_LOCATORS } from '../locators/shop.locators'

export class ShopScreen extends BaseScreen {
  private get productsCounter(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.productsCounter)
  }

  private get allCategoryChip(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.allCategoryChip)
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
