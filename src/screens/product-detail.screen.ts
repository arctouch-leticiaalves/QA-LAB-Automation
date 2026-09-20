import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { PRODUCT_DETAIL_LOCATORS } from '../locators/product-detail.locators'
import { CartScreen } from './cart.screen'

export class ProductDetailScreen extends BaseScreen {
  private get addToCartButton(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.addToCartButton)
  }

  private get productNameTitle(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.productNameTitle)
  }

  private get priceLabel(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.priceLabel)
  }

  private get imageCarousel(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.imageCarousel)
  }

  private get addToFavoritesButton(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.addToFavoritesButton)
  }

  private get removeFromFavoritesButton(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.removeFromFavoritesButton)
  }

  private get increaseQuantityButton(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.increaseQuantityButton)
  }

  private get quantityLabel(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.quantityLabel)
  }

  private get totalLabel(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.totalLabel)
  }

  private get addedToCartSnackbar(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.addedToCartSnackbar)
  }

  private get viewCartButton(): ChainablePromiseElement {
    return $(PRODUCT_DETAIL_LOCATORS.viewCartButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.addToCartButton.waitForDisplayed({ timeout: timeoutMs })
    await this.dismissHintIfShown()
  }

  async isLoaded(): Promise<boolean> {
    return this.addToCartButton.isDisplayed().catch(() => false)
  }

  async getProductName(): Promise<string> {
    await this.productNameTitle.waitForDisplayed({ timeout: 5_000 })
    const desc =
      (await this.productNameTitle.getAttribute('content-desc')) ?? ''
    return desc.replace(/^Product name:\s*/u, '').split('\n')[0].trim()
  }

  async hasProductNameAndPrice(): Promise<boolean> {
    const nameVisible = await this.productNameTitle
      .isDisplayed()
      .catch(() => false)
    const priceVisible = await this.priceLabel.isDisplayed().catch(() => false)
    return nameVisible && priceVisible
  }

  async getCarouselPage(): Promise<{ current: number; total: number }> {
    await this.imageCarousel.waitForDisplayed({ timeout: 5_000 })
    const desc =
      (await this.imageCarousel.getAttribute('content-desc')) ?? ''
    const match = desc.match(/page\s+(\d+)\s+of\s+(\d+)/i)
    if (!match) {
      throw new Error(`Could not parse carousel page from: "${desc}"`)
    }
    return { current: Number(match[1]), total: Number(match[2]) }
  }

  async swipeCarouselToNextImage(): Promise<void> {
    await this.imageCarousel.waitForDisplayed({ timeout: 5_000 })
    const loc = await this.imageCarousel.getLocation()
    const size = await this.imageCarousel.getSize()
    const y = loc.y + Math.floor(size.height / 2)
    await driver.execute('mobile: dragGesture', {
      startX: loc.x + Math.floor(size.width * 0.8),
      startY: y,
      endX: loc.x + Math.floor(size.width * 0.2),
      endY: y,
      speed: 1200,
    })
    await browser.pause(500)
  }

  async favoriteProduct(): Promise<void> {
    await this.addToFavoritesButton.waitForDisplayed({ timeout: 5_000 })
    await this.addToFavoritesButton.click()
    await this.removeFromFavoritesButton.waitForDisplayed({ timeout: 5_000 })
  }

  async unfavoriteProduct(): Promise<void> {
    await this.removeFromFavoritesButton.waitForDisplayed({ timeout: 5_000 })
    await this.removeFromFavoritesButton.click()
    await this.addToFavoritesButton.waitForDisplayed({ timeout: 5_000 })
  }

  async isFavorited(): Promise<boolean> {
    return this.removeFromFavoritesButton.isDisplayed().catch(() => false)
  }

  async increaseQuantity(): Promise<void> {
    await this.increaseQuantityButton.waitForDisplayed({ timeout: 5_000 })
    await this.increaseQuantityButton.click()
    await browser.pause(300)
  }

  async getQuantity(): Promise<number> {
    await this.quantityLabel.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.quantityLabel.getAttribute('content-desc')) ?? ''
    const match = desc.match(/Quantity:\s*(\d+)/i)
    if (!match) {
      throw new Error(`Could not parse quantity from: "${desc}"`)
    }
    return Number(match[1])
  }

  async getUnitPrice(): Promise<number> {
    await this.priceLabel.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.priceLabel.getAttribute('content-desc')) ?? ''
    return this.parseMoney(desc)
  }

  async getTotal(): Promise<number> {
    await this.totalLabel.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.totalLabel.getAttribute('content-desc')) ?? ''
    return this.parseMoney(desc)
  }

  async tapAddToCart(): Promise<void> {
    await this.addToCartButton.waitForDisplayed({ timeout: 5_000 })
    await this.addToCartButton.click()
    await this.addedToCartSnackbar.waitForDisplayed({ timeout: 5_000 })
  }

  async isAddedToCartConfirmationDisplayed(): Promise<boolean> {
    return this.addedToCartSnackbar.isDisplayed().catch(() => false)
  }

  async openCartFromConfirmation(): Promise<CartScreen> {
    await this.viewCartButton.waitForDisplayed({ timeout: 5_000 })
    await this.viewCartButton.click()
    const cart = new CartScreen()
    await cart.waitUntilLoaded()
    return cart
  }

  async goBack(): Promise<void> {
    await browser.back()
  }

  private parseMoney(desc: string): number {
    const match = desc.match(/\$([\d,.]+)/)
    if (!match) {
      throw new Error(`Could not parse money from: "${desc}"`)
    }
    return Number(match[1].replace(/,/g, ''))
  }

  private async dismissHintIfShown(): Promise<void> {
    const hint = $(PRODUCT_DETAIL_LOCATORS.dismissHintButton)
    const visible = await hint.isDisplayed().catch(() => false)
    if (!visible) return
    await driver.execute('mobile: clickGesture', { x: 941, y: 400 })
    await browser.pause(300)
  }
}
