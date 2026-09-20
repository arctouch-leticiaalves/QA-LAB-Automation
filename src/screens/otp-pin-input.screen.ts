import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { OTP_PIN_INPUT_LOCATORS } from '../locators/otp-pin-input.locators'

export class OtpPinInputScreen extends BaseScreen {
  private get otpPinInputTitle(): ChainablePromiseElement {
    return $(OTP_PIN_INPUT_LOCATORS.otpPinInputTitle)
  }

  private get verifyCodeButton(): ChainablePromiseElement {
    return $(OTP_PIN_INPUT_LOCATORS.verifyCodeButton)
  }

  private get clearCodeButton(): ChainablePromiseElement {
    return $(OTP_PIN_INPUT_LOCATORS.clearCodeButton)
  }

  private get invalidCodeMessage(): ChainablePromiseElement {
    return $(OTP_PIN_INPUT_LOCATORS.invalidCodeMessage)
  }

  private get verificationSuccessfulMessage(): ChainablePromiseElement {
    return $(OTP_PIN_INPUT_LOCATORS.verificationSuccessfulMessage)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.otpPinInputTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.dismissHintIfShown()
    await $(OTP_PIN_INPUT_LOCATORS.otpDigit(1)).waitForDisplayed({
      timeout: timeoutMs,
    })
  }

  async isLoaded(): Promise<boolean> {
    return this.otpPinInputTitle.isDisplayed().catch(() => false)
  }

  async areDigitFieldsDisplayed(): Promise<boolean> {
    for (let i = 1; i <= 6; i++) {
      const visible = await $(OTP_PIN_INPUT_LOCATORS.otpDigit(i))
        .isDisplayed()
        .catch(() => false)
      if (!visible) return false
    }
    return true
  }

  /**
   * Enters the PIN digit-by-digit via keyboard after focusing the first cell.
   * Flutter OTP fields auto-advance; setValue on a single View dumps the whole
   * code into digit 1.
   */
  async enterCode(code: string): Promise<void> {
    const firstDigit = $(OTP_PIN_INPUT_LOCATORS.otpDigit(1))
    await firstDigit.waitForDisplayed({ timeout: 5_000 })
    await firstDigit.click()
    await driver.pause(200)
    for (const ch of code) {
      await driver.keys([ch])
      await driver.pause(120)
    }
  }

  async verifyCode(): Promise<void> {
    await this.waitFor(this.verifyCodeButton, 5_000)
    await this.verifyCodeButton.click()
  }

  async clearCode(): Promise<void> {
    await this.waitFor(this.clearCodeButton, 5_000)
    await this.clearCodeButton.click()
  }

  async isInvalidCodeDisplayed(): Promise<boolean> {
    return this.invalidCodeMessage.isDisplayed().catch(() => false)
  }

  async waitForInvalidCode(timeoutMs = 5_000): Promise<void> {
    await this.invalidCodeMessage.waitForDisplayed({ timeout: timeoutMs })
  }

  async waitForInvalidCodeHidden(timeoutMs = 5_000): Promise<void> {
    await this.invalidCodeMessage.waitForDisplayed({
      timeout: timeoutMs,
      reverse: true,
    })
  }

  async isVerificationSuccessfulDisplayed(): Promise<boolean> {
    return this.verificationSuccessfulMessage.isDisplayed().catch(() => false)
  }

  async waitForVerificationSuccessful(timeoutMs = 5_000): Promise<void> {
    await this.verificationSuccessfulMessage.waitForDisplayed({
      timeout: timeoutMs,
    })
  }

  private async dismissHintIfShown(): Promise<void> {
    const hint = $(OTP_PIN_INPUT_LOCATORS.dismissHintButton)
    const visible = await hint.isDisplayed().catch(() => false)
    if (!visible) return
    await driver.execute('mobile: clickGesture', { x: 941, y: 400 })
    await driver.pause(300)
  }
}
