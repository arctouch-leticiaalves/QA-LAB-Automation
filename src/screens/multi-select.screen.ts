import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { MULTI_SELECT_LOCATORS } from '../locators/multi-select.locators'

export class MultiSelectScreen extends BaseScreen {
  private get multiSelectTitle(): ChainablePromiseElement {
    return $(MULTI_SELECT_LOCATORS.multiSelectTitle)
  }

  private get selectAllButton(): ChainablePromiseElement {
    return $(MULTI_SELECT_LOCATORS.selectAllButton)
  }

  private get deleteButton(): ChainablePromiseElement {
    return $(MULTI_SELECT_LOCATORS.deleteButton)
  }

  private get selectedCountLabel(): ChainablePromiseElement {
    return $(MULTI_SELECT_LOCATORS.selectedCountLabel)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.multiSelectTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.selectAllButton.waitForDisplayed({ timeout: timeoutMs })
    await this.selectedCountLabel.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.multiSelectTitle.isDisplayed().catch(() => false)
  }

  async getSelectedCount(): Promise<number> {
    await this.selectedCountLabel.waitForDisplayed({ timeout: 5_000 })
    const desc =
      (await this.selectedCountLabel.getAttribute('content-desc')) ?? ''
    const match = desc.match(/Selected count:\s*(\d+)/u)
    if (!match) {
      throw new Error(`Could not parse selected count from: "${desc}"`)
    }
    return Number(match[1])
  }

  async selectItem(name: string): Promise<void> {
    const item = $(MULTI_SELECT_LOCATORS.item(name))
    await this.waitFor(item, 5_000)
    await item.click()
    await $(MULTI_SELECT_LOCATORS.itemSelected(name)).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async isItemSelected(name: string): Promise<boolean> {
    return $(MULTI_SELECT_LOCATORS.itemSelected(name))
      .isDisplayed()
      .catch(() => false)
  }

  async tapSelectAll(): Promise<void> {
    await this.waitFor(this.selectAllButton, 5_000)
    await this.selectAllButton.click()
    await $(MULTI_SELECT_LOCATORS.deselectAllButton).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async isDeselectAllDisplayed(): Promise<boolean> {
    return $(MULTI_SELECT_LOCATORS.deselectAllButton)
      .isDisplayed()
      .catch(() => false)
  }

  async tapDelete(): Promise<void> {
    await this.waitFor(this.deleteButton, 5_000)
    await this.deleteButton.click()
  }

  async isItemVisible(name: string): Promise<boolean> {
    return $(MULTI_SELECT_LOCATORS.item(name))
      .isDisplayed()
      .catch(() => false)
  }
}
