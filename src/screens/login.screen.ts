import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { LOGIN_LOCATORS } from '../locators/login.locators'

export class LoginScreen extends BaseScreen {
  private get emailField(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.emailField)
  }

  private get passwordField(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.passwordField)
  }

  private get signInButton(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.signInButton)
  }

  private get welcomeLabel(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.welcomeLabel)
  }

  private get errorBanner(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.errorBanner)
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
