import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { FORGOT_PASSWORD_LOCATORS } from '../locators/forgot-password.locators'
import { LoginScreen } from './login.screen'

export class ForgotPasswordScreen extends BaseScreen {
  private get forgotPasswordTitle(): ChainablePromiseElement {
    return $(FORGOT_PASSWORD_LOCATORS.forgotPasswordTitle)
  }

  private get emailField(): ChainablePromiseElement {
    return $(FORGOT_PASSWORD_LOCATORS.emailField)
  }

  private get sendResetLinkButton(): ChainablePromiseElement {
    return $(FORGOT_PASSWORD_LOCATORS.sendResetLinkButton)
  }

  private get errorBanner(): ChainablePromiseElement {
    return $(FORGOT_PASSWORD_LOCATORS.errorBanner)
  }

  private get successConfirmation(): ChainablePromiseElement {
    return $(FORGOT_PASSWORD_LOCATORS.successConfirmation)
  }

  private get backToSignInButton(): ChainablePromiseElement {
    return $(FORGOT_PASSWORD_LOCATORS.backToSignInButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.forgotPasswordTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.sendResetLinkButton.waitForDisplayed({ timeout: timeoutMs })
    await this.dismissHintIfShown()
  }

  async isLoaded(): Promise<boolean> {
    return this.forgotPasswordTitle.isDisplayed().catch(() => false)
  }

  async submitEmail(email: string): Promise<void> {
    await this.fillTextField(this.emailField, email)
    await this.hideKeyboardIfShown()
    await this.waitFor(this.sendResetLinkButton, 5_000)
    await this.sendResetLinkButton.click()
  }

  async waitForSuccess(timeoutMs = 8_000): Promise<void> {
    await this.successConfirmation.waitForDisplayed({ timeout: timeoutMs })
  }

  async isSuccessDisplayed(): Promise<boolean> {
    return this.successConfirmation.isDisplayed().catch(() => false)
  }

  async getSuccessEmailMessage(): Promise<string> {
    const el = $(FORGOT_PASSWORD_LOCATORS.successEmailMessage)
    await el.waitForDisplayed({ timeout: 5_000 })
    return (await el.getAttribute('content-desc')) ?? ''
  }

  async hasErrorIndicator(): Promise<boolean> {
    return this.errorBanner.isDisplayed().catch(() => false)
  }

  async getErrorMessage(): Promise<string> {
    await this.errorBanner.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.errorBanner.getAttribute('content-desc')) ?? ''
    return desc.replace(/^Error message\s*/u, '').trim()
  }

  async tapBackToSignIn(): Promise<LoginScreen> {
    await this.waitFor(this.backToSignInButton, 5_000)
    await this.backToSignInButton.click()
    const login = new LoginScreen()
    await login.waitUntilLoaded()
    return login
  }

  private async dismissHintIfShown(): Promise<void> {
    const hint = $(FORGOT_PASSWORD_LOCATORS.dismissHintButton)
    const visible = await hint.isDisplayed().catch(() => false)
    if (!visible) return
    await driver.execute('mobile: clickGesture', { x: 941, y: 400 })
    await browser.pause(300)
  }
}
