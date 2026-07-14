import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { PRODUCT_DETAIL_LOCATORS } from '../locators/product-detail.locators'

export class ProductDetailScreen extends BaseScreen {
  private get addToCartButton(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.addToCartButton)
  }

  private get productNameTitle(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.productNameTitle)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.addToCartButton.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.addToCartButton.isDisplayed().catch(() => false)
  }

  async getProductName(): Promise<string> {
    await this.productNameTitle.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.productNameTitle.getAttribute('content-desc')) ?? ''
    return desc.replace(/^Product name:\s*/u, '').split('\n')[0].trim()
  }

  async tapAddToCart(): Promise<void> {
    await this.addToCartButton.waitForDisplayed({ timeout: 5_000 })
    await this.addToCartButton.click()
    // The confirmation snackbar is the signal that the item registered in the cart
    await $(PRODUCT_DETAIL_LOCATORS.addedToCartSnackbar).waitForDisplayed({ timeout: 5_000 })
  }

  async goBack(): Promise<void> {
    await browser.back()
  }
}
