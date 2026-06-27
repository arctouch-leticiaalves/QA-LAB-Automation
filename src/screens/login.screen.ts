import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'

// XPath used because the email/password EditTexts have no content-desc and no
// resource-id, only a `hint` attribute. UiSelector cannot match by hint.
// Tracked in LOCATOR_DEBT.md — dev team to add contentDescription.
const EMAIL_FIELD = '//android.widget.EditText[contains(@hint, "Email")]'
const PASSWORD_FIELD = '//android.widget.EditText[contains(@hint, "Password")]'

export class LoginScreen extends BaseScreen {
  private get emailField(): ChainablePromiseElement {
    return $(EMAIL_FIELD)
  }

  private get passwordField(): ChainablePromiseElement {
    return $(PASSWORD_FIELD)
  }

  private get signInButton(): ChainablePromiseElement {
    return $('~Sign In')
  }

  private get welcomeLabel(): ChainablePromiseElement {
    return $('~Welcome')
  }

  private get errorBanner(): ChainablePromiseElement {
    return $('android=new UiSelector().descriptionStartsWith("Error message")')
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.welcomeLabel.waitForDisplayed({ timeout: timeoutMs })
    await this.signInButton.waitForDisplayed({ timeout: timeoutMs })
  }

  async submitForm(email: string, password: string): Promise<void> {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.hideKeyboardIfShown()
    await this.signInButton.click()
  }

  private async fillEmail(value: string): Promise<void> {
    const field = this.emailField
    await field.waitForDisplayed({ timeout: 10_000 })
    await field.click()
    await field.clearValue()
    if (value.length > 0) {
      await field.setValue(value)
    }
  }

  private async fillPassword(value: string): Promise<void> {
    const field = this.passwordField
    await field.waitForDisplayed({ timeout: 10_000 })
    await field.click()
    await field.clearValue()
    if (value.length > 0) {
      await field.setValue(value)
    }
  }

  private async hideKeyboardIfShown(): Promise<void> {
    try {
      if (await driver.isKeyboardShown()) {
        await driver.hideKeyboard()
      }
    } catch {
      /* hideKeyboard occasionally throws on Samsung; ignore */
    }
  }

  async isLoaded(): Promise<boolean> {
    return this.welcomeLabel.isDisplayed()
  }

  async hasErrorIndicator(): Promise<boolean> {
    return this.errorBanner.isDisplayed().catch(() => false)
  }

  async getErrorMessage(): Promise<string> {
    await this.errorBanner.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.errorBanner.getAttribute('content-desc')) ?? ''
    return desc.replace(/^Error message\s*/u, '').trim()
  }
}
