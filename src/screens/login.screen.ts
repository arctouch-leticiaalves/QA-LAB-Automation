import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { COMMON_LOCATORS } from '../locators/common.locators'
import { LOGIN_LOCATORS } from '../locators/login.locators'

export class LoginScreen extends BaseScreen {
  private get emailField(): ChainablePromiseElement {
    return $(COMMON_LOCATORS.emailField)
  }

  private get passwordField(): ChainablePromiseElement {
    return $(COMMON_LOCATORS.passwordField)
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
    await this.fillTextField(this.emailField, email)
    await this.fillTextField(this.passwordField, password)
    await this.hideKeyboardIfShown()
    await this.signInButton.click()
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
