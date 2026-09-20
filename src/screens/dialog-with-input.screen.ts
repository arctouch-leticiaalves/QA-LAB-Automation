import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { DIALOG_WITH_INPUT_LOCATORS } from '../locators/dialog-with-input.locators'

export class DialogWithInputScreen extends BaseScreen {
  private get dialogWithInputTitle(): ChainablePromiseElement {
    return $(DIALOG_WITH_INPUT_LOCATORS.dialogWithInputTitle)
  }

  private get openTextDialogButton(): ChainablePromiseElement {
    return $(DIALOG_WITH_INPUT_LOCATORS.openTextDialogButton)
  }

  private get nameInput(): ChainablePromiseElement {
    return $(DIALOG_WITH_INPUT_LOCATORS.nameInput)
  }

  private get submitButton(): ChainablePromiseElement {
    return $(DIALOG_WITH_INPUT_LOCATORS.submitButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.dialogWithInputTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.openTextDialogButton.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.dialogWithInputTitle.isDisplayed().catch(() => false)
  }

  async openTextDialog(): Promise<void> {
    await this.waitFor(this.openTextDialogButton, 5_000)
    await this.openTextDialogButton.click()
    await $(DIALOG_WITH_INPUT_LOCATORS.textDialogTitle).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async submitName(name: string): Promise<void> {
    await this.nameInput.waitForDisplayed({ timeout: 5_000 })
    await this.fillTextField(this.nameInput, name)
    await this.dismissKeyboardKeepingDialog()

    await this.submitButton.waitForDisplayed({ timeout: 5_000 })
    await this.submitButton.click()

    await $(DIALOG_WITH_INPUT_LOCATORS.submittedName(name)).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async isSubmittedNameDisplayed(name: string): Promise<boolean> {
    return $(DIALOG_WITH_INPUT_LOCATORS.submittedName(name))
      .isDisplayed()
      .catch(() => false)
  }

  /**
   * Hides the soft keyboard with BACK so dialog actions become tappable.
   * `hideKeyboard()` is unreliable on the emulator and can leave Submit covered.
   */
  private async dismissKeyboardKeepingDialog(): Promise<void> {
    try {
      if (await driver.isKeyboardShown()) {
        await driver.pressKeyCode(4)
      }
    } catch {
      /* ignore */
    }
    // Ensure Submit is exposed even if isKeyboardShown was false/stale.
    const submitVisible = await this.submitButton
      .isDisplayed()
      .catch(() => false)
    if (!submitVisible) {
      try {
        await driver.pressKeyCode(4)
      } catch {
        /* ignore */
      }
    }
  }
}
