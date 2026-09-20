import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import {
  ACCORDION_LOCATORS,
  ACCORDION_SECTIONS,
} from '../locators/accordion.locators'

export class AccordionScreen extends BaseScreen {
  private get accordionTitle(): ChainablePromiseElement {
    return $(ACCORDION_LOCATORS.accordionTitle)
  }

  private get expandAllButton(): ChainablePromiseElement {
    return $(ACCORDION_LOCATORS.expandAllButton)
  }

  private get collapseAllButton(): ChainablePromiseElement {
    return $(ACCORDION_LOCATORS.collapseAllButton)
  }

  private get whatIsThisAppContent(): ChainablePromiseElement {
    return $(ACCORDION_LOCATORS.whatIsThisAppContent)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.accordionTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.expandAllButton.waitForDisplayed({ timeout: timeoutMs })
    await $(
      ACCORDION_LOCATORS.sectionHeader(
        ACCORDION_SECTIONS.whatIsThisApp,
        'Collapsed',
      ),
    ).waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.accordionTitle.isDisplayed().catch(() => false)
  }

  async isExpandAllDisplayed(): Promise<boolean> {
    return this.expandAllButton.isDisplayed().catch(() => false)
  }

  async isCollapseAllDisplayed(): Promise<boolean> {
    return this.collapseAllButton.isDisplayed().catch(() => false)
  }

  async getExpandedSectionCount(): Promise<number> {
    for (let count = 0; count <= 5; count++) {
      const indicator = $(ACCORDION_LOCATORS.expandedCount(count))
      if (await indicator.isDisplayed().catch(() => false)) {
        return count
      }
    }
    throw new Error('Could not determine accordion expanded section count')
  }

  async expandSection(title: string): Promise<void> {
    const collapsed = $(ACCORDION_LOCATORS.sectionHeader(title, 'Collapsed'))
    await collapsed.waitForDisplayed({ timeout: 5_000 })
    await collapsed.click()
    await $(ACCORDION_LOCATORS.sectionHeader(title, 'Expanded')).waitForDisplayed(
      { timeout: 5_000 },
    )
  }

  async collapseSection(title: string): Promise<void> {
    const expanded = $(ACCORDION_LOCATORS.sectionHeader(title, 'Expanded'))
    await expanded.waitForDisplayed({ timeout: 5_000 })
    await expanded.click()
    await $(
      ACCORDION_LOCATORS.sectionHeader(title, 'Collapsed'),
    ).waitForDisplayed({ timeout: 5_000 })
  }

  async tapExpandAll(): Promise<void> {
    await this.expandAllButton.waitForDisplayed({ timeout: 5_000 })
    await this.expandAllButton.click()
    await this.collapseAllButton.waitForDisplayed({ timeout: 5_000 })
    await browser.waitUntil(
      async () => (await this.getExpandedSectionCount()) === 5,
      {
        timeout: 5_000,
        timeoutMsg: 'Expected all 5 accordion sections to be expanded',
      },
    )
  }

  async tapCollapseAll(): Promise<void> {
    await this.collapseAllButton.waitForDisplayed({ timeout: 5_000 })
    await this.collapseAllButton.click()
    await this.expandAllButton.waitForDisplayed({ timeout: 5_000 })
    await browser.waitUntil(
      async () => (await this.getExpandedSectionCount()) === 0,
      {
        timeout: 5_000,
        timeoutMsg: 'Expected all accordion sections to be collapsed',
      },
    )
  }

  async isSectionExpanded(title: string): Promise<boolean> {
    return $(ACCORDION_LOCATORS.sectionHeader(title, 'Expanded'))
      .isDisplayed()
      .catch(() => false)
  }

  async isSectionCollapsed(title: string): Promise<boolean> {
    return $(ACCORDION_LOCATORS.sectionHeader(title, 'Collapsed'))
      .isDisplayed()
      .catch(() => false)
  }

  async isWhatIsThisAppContentDisplayed(): Promise<boolean> {
    return this.whatIsThisAppContent.isDisplayed().catch(() => false)
  }
}
