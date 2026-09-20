import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import {
  ORDERS_LOCATORS,
  ORDER_DETAIL_LOCATORS,
} from '../locators/orders.locators'

export class OrdersScreen extends BaseScreen {
  private get myOrdersTitle(): ChainablePromiseElement {
    return $(ORDERS_LOCATORS.myOrdersTitle)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.myOrdersTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.dismissHintIfShown()
  }

  async isLoaded(): Promise<boolean> {
    return this.myOrdersTitle.isDisplayed().catch(() => false)
  }

  async isFilterSelected(status: string): Promise<boolean> {
    const chip = $(ORDERS_LOCATORS.filterChip(status))
    await chip.waitForDisplayed({ timeout: 5_000 })
    const desc = (await chip.getAttribute('content-desc')) ?? ''
    return desc.includes('selected')
  }

  async tapFilter(status: string): Promise<void> {
    const chip = $(ORDERS_LOCATORS.filterChip(status))
    await this.waitFor(chip, 5_000)
    await chip.click()
    await browser.pause(400)
  }

  async isNoOrdersFoundVisible(): Promise<boolean> {
    return $(ORDERS_LOCATORS.noOrdersFound)
      .isDisplayed()
      .catch(() => false)
  }

  async isOrderVisible(orderId: string): Promise<boolean> {
    return $(ORDERS_LOCATORS.orderCard(orderId))
      .isDisplayed()
      .catch(() => false)
  }

  async isOrderVisibleWithStatus(
    orderId: string,
    status: string,
  ): Promise<boolean> {
    return $(ORDERS_LOCATORS.orderCardWithStatus(orderId, status))
      .isDisplayed()
      .catch(() => false)
  }

  async openOrder(orderId: string): Promise<OrderDetailScreen> {
    const card = $(ORDERS_LOCATORS.orderCard(orderId))
    await this.waitFor(card, 5_000)
    await card.click()
    const detail = new OrderDetailScreen(orderId)
    await detail.waitUntilLoaded()
    return detail
  }

  private async dismissHintIfShown(): Promise<void> {
    const hint = $(ORDERS_LOCATORS.dismissHintButton)
    const visible = await hint.isDisplayed().catch(() => false)
    if (!visible) return
    await driver.execute('mobile: clickGesture', { x: 941, y: 400 })
    await browser.pause(300)
  }
}

export class OrderDetailScreen extends BaseScreen {
  constructor(private readonly orderId: string) {
    super()
  }

  private get title(): ChainablePromiseElement {
    return $(ORDER_DETAIL_LOCATORS.orderDetailTitle(this.orderId))
  }

  private get orderIdLabel(): ChainablePromiseElement {
    return $(ORDER_DETAIL_LOCATORS.orderIdLabel(this.orderId))
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.orderIdLabel.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.orderIdLabel.isDisplayed().catch(() => false)
  }

  async hasStatus(status: string): Promise<boolean> {
    return $(ORDER_DETAIL_LOCATORS.orderStatus(status))
      .isDisplayed()
      .catch(() => false)
  }

  async isItemsSectionVisible(): Promise<boolean> {
    return $(ORDER_DETAIL_LOCATORS.itemsSection)
      .isDisplayed()
      .catch(() => false)
  }

  async isOrderSummaryVisible(): Promise<boolean> {
    return $(ORDER_DETAIL_LOCATORS.orderSummarySection)
      .isDisplayed()
      .catch(() => false)
  }
}
