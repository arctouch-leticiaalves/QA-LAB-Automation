import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { CHECKOUT_LOCATORS } from '../locators/checkout.locators'

export class CheckoutScreen extends BaseScreen {
  private get stepIndicator(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.stepIndicator)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.stepIndicator.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.stepIndicator.isDisplayed().catch(() => false)
  }
}
