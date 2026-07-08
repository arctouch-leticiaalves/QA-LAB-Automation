import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { SHOP_LOCATORS } from '../locators/shop.locators'
import { ProductDetailScreen } from './product-detail.screen'

export class ShopScreen extends BaseScreen {
  private get productsCounter(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.productsCounter)
  }

  private get allCategoryChip(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.allCategoryChip)
  }

  private get searchField(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.searchField)
  }

  private get firstProductCard(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.firstProductCard)
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

  async tapCategoryChip(category: string): Promise<void> {
    const chip = $(`~${category}`)
    await chip.waitForDisplayed({ timeout: 5_000 })
    await chip.click()
    await browser.pause(500)
  }

  async isCategoryChipSelected(category: string): Promise<boolean> {
    const chip = $(`~${category}`)
    const selected = await chip.getAttribute('selected').catch(() => 'false')
    return selected === 'true'
  }

  async search(query: string): Promise<void> {
    await this.fillTextField(this.searchField, query)
    await this.hideKeyboardIfShown()
    await browser.pause(800)
  }

  async hasNoProducts(): Promise<boolean> {
    const visible = await this.firstProductCard.isDisplayed().catch(() => false)
    return !visible
  }

  async tapFirstProduct(): Promise<ProductDetailScreen> {
    await this.firstProductCard.waitForDisplayed({ timeout: 5_000 })
    await this.firstProductCard.click()
    const detail = new ProductDetailScreen()
    await detail.waitUntilLoaded()
    return detail
  }
}
