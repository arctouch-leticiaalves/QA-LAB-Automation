import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { CART_LOCATORS } from '../locators/cart.locators'
import { ShopScreen } from './shop.screen'
import { CheckoutScreen } from './checkout.screen'

export class CartScreen extends BaseScreen {

  private get cartHeader(): ChainablePromiseElement {
    return $(CART_LOCATORS.cartHeader)
  }
  private get emptyMessage(): ChainablePromiseElement {
    return $(CART_LOCATORS.emptyCartMessage)
  }
  private get browseProductsButton(): ChainablePromiseElement {
    return $(CART_LOCATORS.browseProductsButton)
  }
  private get firstCartItem(): ChainablePromiseElement {
    return $(CART_LOCATORS.firstCartItem)
  }
  private get increaseQuantityButton(): ChainablePromiseElement {
    return $(CART_LOCATORS.increaseQuantity)
  }
  private get decreaseQuantityButton(): ChainablePromiseElement {
    return $(CART_LOCATORS.decreaseQuantity)
  }
  private get orderTotal(): ChainablePromiseElement {
    return $(CART_LOCATORS.orderTotal)
  }
  private get checkoutButton(): ChainablePromiseElement {
    return $(CART_LOCATORS.proceedToCheckoutButton)
  }
  private get addedToCartSnackbar(): ChainablePromiseElement {
    return $(CART_LOCATORS.addedToCartSnackbar)
  }
  private get removedSnackbar(): ChainablePromiseElement {
    return $(CART_LOCATORS.removedSnackbar)
  }
  private get undoButton(): ChainablePromiseElement {
    return $(CART_LOCATORS.undoButton)
  }
  private get cartTab(): ChainablePromiseElement {
    return $(CART_LOCATORS.cartTab)
  }

  async waitUntilLoaded(timeoutMs = 10_000): Promise<void> {
    await this.cartHeader.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.cartHeader.isDisplayed().catch(() => false)
  }

  async hasItems(timeoutMs = 4_000): Promise<boolean> {
    return this.firstCartItem
      .waitForDisplayed({ timeout: timeoutMs })
      .then(() => true)
      .catch(() => false)
  }

  async isEmptyMessageVisible(timeoutMs = 4_000): Promise<boolean> {
    return this.emptyMessage
      .waitForDisplayed({ timeout: timeoutMs })
      .then(() => true)
      .catch(() => false)
  }

  async getOrderTotal(): Promise<string> {
    await this.waitFor(this.orderTotal, 5_000)
    const desc = (await this.orderTotal.getAttribute('content-desc')) ?? ''
    return desc.split('\n')[0].replace('Order total: ', '').trim()
  }

  async openFromNavBar(): Promise<void> {
    await this.waitFor(this.cartTab, 5_000)
    await this.cartTab.click()
    await this.waitUntilLoaded()
    await this.dismissSnackbar()
  }

  async tapBrowseProducts(): Promise<ShopScreen> {
    await this.waitFor(this.browseProductsButton, 5_000)
    await this.browseProductsButton.click()
    const shop = new ShopScreen()
    await shop.waitUntilLoaded()
    return shop
  }

  async increaseItemQuantity(): Promise<void> {
    await this.waitFor(this.increaseQuantityButton, 5_000)
    await this.increaseQuantityButton.click()
  }

  async decreaseItemQuantity(): Promise<void> {
    await this.waitFor(this.decreaseQuantityButton, 5_000)
    await this.decreaseQuantityButton.click()
  }

  async swipeFirstItemLeft(): Promise<void> {
    await this.dismissSnackbar()
    await this.waitFor(this.firstCartItem, 5_000)
    const { x, y } = await this.firstCartItem.getLocation()
    const { width, height } = await this.firstCartItem.getSize()
    await driver.execute('mobile: swipeGesture', {
      left: x + 120,
      top: y,
      width: width - 240,
      height,
      direction: 'left',
      percent: 0.95,
    })
    await this.removedSnackbar.waitForDisplayed({ timeout: 5_000 })
  }

  async tapUndo(): Promise<void> {
    await this.waitFor(this.undoButton, 5_000)
    await this.undoButton.click()
    await this.removedSnackbar.waitForDisplayed({ timeout: 5_000, reverse: true })
  }

  async tapCheckout(): Promise<CheckoutScreen> {
    await this.dismissSnackbar()
    await this.waitFor(this.checkoutButton, 5_000)
    await this.checkoutButton.click()
    const checkout = new CheckoutScreen()
    await checkout.waitUntilLoaded()
    return checkout
  }

  async dismissSnackbar(): Promise<void> {
    for (const snackbar of [this.addedToCartSnackbar, this.removedSnackbar]) {
      const visible = await snackbar.isDisplayed().catch(() => false)
      if (!visible) continue
      await this.swipeElementDown(snackbar)
      await snackbar.waitForDisplayed({ timeout: 4_000, reverse: true })
    }
  }

  private async swipeElementDown(el: ChainablePromiseElement): Promise<void> {
    const { x, y } = await el.getLocation()
    const { width } = await el.getSize()
    const startX = Math.round(x + width / 2)
    const startY = Math.round(y + 20)
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 250, x: startX, y: startY + 250 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ])
    await driver.releaseActions()
  }
}
