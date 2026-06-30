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

  /**
   * Fills a text field reliably: wait → click → clear → setValue. An empty
   * `value` leaves the field cleared (used for empty-field validation tests).
   */
  protected async fillTextField(
    field: ChainablePromiseElement,
    value: string,
    timeoutMs = 10_000,
  ): Promise<void> {
    await field.waitForDisplayed({ timeout: timeoutMs })
    await field.click()
    await field.clearValue()
    if (value.length > 0) {
      await field.setValue(value)
    }
  }

  /**
   * Dismisses the soft keyboard if it is currently shown. Wrapped in try/catch
   * because `hideKeyboard` occasionally throws on Samsung devices even when
   * the keyboard is visible.
   */
  protected async hideKeyboardIfShown(): Promise<void> {
    try {
      if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard()
      }
    } catch {
      /* ignore */
    }
  }

  abstract isLoaded(): Promise<boolean>
}
