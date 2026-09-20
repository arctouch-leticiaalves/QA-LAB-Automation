import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { FAVORITES_LOCATORS } from '../locators/favorites.locators'
import { ProductDetailScreen } from './product-detail.screen'

export class FavoritesScreen extends BaseScreen {
  private get myFavoritesTitle(): ChainablePromiseElement {
    return $(FAVORITES_LOCATORS.myFavoritesTitle)
  }

  private get emptyMessage(): ChainablePromiseElement {
    return $(FAVORITES_LOCATORS.emptyMessage)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.myFavoritesTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.dismissHintIfShown()
  }

  async isLoaded(): Promise<boolean> {
    return this.myFavoritesTitle.isDisplayed().catch(() => false)
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyMessage.isDisplayed().catch(() => false)
  }

  async isProductVisible(productName: string): Promise<boolean> {
    return $(FAVORITES_LOCATORS.favoriteItem(productName))
      .isDisplayed()
      .catch(() => false)
  }

  async openProduct(productName: string): Promise<ProductDetailScreen> {
    const item = $(FAVORITES_LOCATORS.favoriteItem(productName))
    await this.waitFor(item, 5_000)
    await item.click()
    const detail = new ProductDetailScreen()
    await detail.waitUntilLoaded()
    return detail
  }

  async removeProduct(productName: string): Promise<void> {
    const item = $(FAVORITES_LOCATORS.favoriteItem(productName))
    await this.waitFor(item, 5_000)
    const { x, y } = await item.getLocation()
    const { width, height } = await item.getSize()

    // Trailing heart control sits on the right edge of the row.
    await driver.execute('mobile: clickGesture', {
      x: Math.round(x + width - 60),
      y: Math.round(y + height / 2),
    })

    await $(FAVORITES_LOCATORS.emptyMessage).waitForDisplayed({
      timeout: 8_000,
    })
  }

  private async dismissHintIfShown(): Promise<void> {
    const hint = $(FAVORITES_LOCATORS.dismissHintButton)
    const visible = await hint.isDisplayed().catch(() => false)
    if (!visible) return
    await driver.execute('mobile: clickGesture', { x: 941, y: 396 })
    await browser.pause(300)
  }
}
