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

  private get favIcon(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.firstProductFavoriteIcon)
  }

  private get menuActions(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.longPressMenu)
  }

  private get addToCart(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.longPressAddToCart)
  }

  private get addToCartSnackbar(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.addedToCartSnackbar)
  }

  private get listToggle(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.listViewToggle)
  }

  private get gridToggle(): ChainablePromiseElement {
    return $(SHOP_LOCATORS.gridViewToggle)
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

  private async getFavIconDesc(): Promise<string> {
    const desc = (await this.favIcon.getAttribute('content-desc').catch(() => '')) ?? ''
    return desc.toLowerCase()
  }

  async ensureProductIsNotFavorited(): Promise<void> {
    const desc = await this.getFavIconDesc()
    if (desc.startsWith('remove')) {
      await this.favIcon.click()
      await browser.pause(500)
    }
  }

  async tapFavIcon(): Promise<void> {
    await this.favIcon.waitForDisplayed({ timeout: 5_000 })
    await this.favIcon.click()
    await browser.pause(500)
  }

  async isFavIconSelected(): Promise<boolean> {
    await this.favIcon.waitForDisplayed({ timeout: 5_000 })
    const desc = await this.getFavIconDesc()
    return desc.startsWith('remove')
  }

  async longPressFirstProduct(): Promise<void> {
    const el = await this.firstProductCard.waitForDisplayed({ timeout: 5_000 }).then(() => this.firstProductCard)
    await driver.execute('mobile: longClickGesture', {
      elementId: el.elementId,
      duration: 1500,
    })
    await browser.pause(500)
    await this.menuActions.waitForDisplayed({ timeout: 5_000})
  }

  async tapAddToCart(): Promise<void> {
    await this.menuActions.waitForDisplayed({ timeout: 5_000 })
    await this.addToCart.click()
  }

  async addToCartSnackbarVisible(): Promise<boolean> {
    return this.addToCartSnackbar.waitForDisplayed({ timeout: 5_000 }).then(() => true).catch(() => false)
  }

  async tapAddToFavorites(): Promise<void> {
    const btn = $(SHOP_LOCATORS.longPressAddToFavorites)
    await btn.waitForDisplayed({ timeout: 5_000 })
    await btn.click()
  }

  async tapViewDetails(): Promise<ProductDetailScreen> {
    const btn = $(SHOP_LOCATORS.longPressViewDetails)
    await btn.waitForDisplayed({ timeout: 5_000 })
    await btn.click()
    const detail = new ProductDetailScreen()
    await detail.waitUntilLoaded()
    return detail
  }

  async ensureListView(): Promise<void> {
    const inGridView = await this.listToggle.isDisplayed().catch(() => false)
    if (inGridView) {
      await this.listToggle.click()
      await browser.pause(500)
    }
  }

  async isInGridView(): Promise<boolean> {
    return this.listToggle.isDisplayed().catch(() => false)
  }
  async isInListView(): Promise<boolean> {
    return this.gridToggle.isDisplayed().catch(() => false)
  }
  async tapGridView(): Promise<void> {
    await this.ensureListView()
    await this.gridToggle.waitForDisplayed({ timeout: 5_000 })
    await this.gridToggle.click()
    await browser.pause(500)
  }
  async tapListView(): Promise<void> {
    await this.listToggle.waitForDisplayed({ timeout: 5_000 })
    await this.listToggle.click()
    await browser.pause(500)
  }

} 