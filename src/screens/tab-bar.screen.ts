import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { TAB_BAR_LOCATORS, TAB_BAR_TABS } from '../locators/tab-bar.locators'

export class TabBarScreen extends BaseScreen {
  private get tabBarTitle(): ChainablePromiseElement {
    return $(TAB_BAR_LOCATORS.tabBarTitle)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.tabBarTitle.waitForDisplayed({ timeout: timeoutMs })
    await $(TAB_BAR_LOCATORS.tabByIndex(TAB_BAR_TABS.home.index)).waitForDisplayed(
      { timeout: timeoutMs },
    )
    await $(TAB_BAR_LOCATORS.activeTab(1)).waitForDisplayed({
      timeout: timeoutMs,
    })
  }

  async isLoaded(): Promise<boolean> {
    return this.tabBarTitle.isDisplayed().catch(() => false)
  }

  async isTabVisible(index: number): Promise<boolean> {
    return $(TAB_BAR_LOCATORS.tabByIndex(index))
      .isDisplayed()
      .catch(() => false)
  }

  async getActiveTabIndex(): Promise<number> {
    for (let index = 1; index <= 4; index++) {
      const visible = await $(TAB_BAR_LOCATORS.activeTab(index))
        .isDisplayed()
        .catch(() => false)
      if (visible) {
        return index
      }
    }
    throw new Error('Could not determine active tab index')
  }

  async openTab(name: string, index: number): Promise<void> {
    const tab = $(TAB_BAR_LOCATORS.tabByIndex(index))
    await this.waitFor(tab, 5_000)
    await tab.click()
    await $(TAB_BAR_LOCATORS.tabContent(name)).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async isTabContentDisplayed(name: string): Promise<boolean> {
    return $(TAB_BAR_LOCATORS.tabContent(name))
      .isDisplayed()
      .catch(() => false)
  }
}
