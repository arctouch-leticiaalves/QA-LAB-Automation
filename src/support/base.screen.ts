import type { ChainablePromiseElement } from 'webdriverio'

export abstract class BaseScreen {
  protected async waitFor(
    el: ChainablePromiseElement,
    timeoutMs = 15_000,
  ): Promise<void> {
    await el.waitForDisplayed({ timeout: timeoutMs })
  }

  protected async scrollIntoView(uiSelector: string): Promise<void> {
    await $(
      `android=new UiScrollable(new UiSelector().scrollable(true).instance(0))` +
        `.scrollIntoView(${uiSelector})`,
    )
  }

  abstract isLoaded(): Promise<boolean>
}
