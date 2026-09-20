import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { CHECKOUT_LOCATORS } from '../locators/checkout.locators'
import type {
  CheckoutAddressData,
  CheckoutPaymentData,
} from '../support/test-data/checkout'

export class CheckoutScreen extends BaseScreen {
  private get stepIndicator(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.stepIndicator)
  }

  private get addressStepIndicator(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.addressStepIndicator)
  }

  private get paymentStepIndicator(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.paymentStepIndicator)
  }

  private get reviewStepIndicator(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.reviewStepIndicator)
  }

  private get fullNameField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.fullNameField)
  }

  private get phoneField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.phoneField)
  }

  private get addressField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.addressField)
  }

  private get cityField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.cityField)
  }

  private get stateField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.stateField)
  }

  private get zipCodeField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.zipCodeField)
  }

  private get cardNumberField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.cardNumberField)
  }

  private get expiryField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.expiryField)
  }

  private get cvvField(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.cvvField)
  }

  private get nextButton(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.nextButton)
  }

  private get placeOrderButton(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.placeOrderButton)
  }

  private get orderConfirmation(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.orderConfirmation)
  }

  private get paymentDeclined(): ChainablePromiseElement {
    return $(CHECKOUT_LOCATORS.paymentDeclined)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.stepIndicator.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.stepIndicator.isDisplayed().catch(() => false)
  }

  async isOnAddressStep(): Promise<boolean> {
    return this.addressStepIndicator.isDisplayed().catch(() => false)
  }

  async isOnPaymentStep(): Promise<boolean> {
    return this.paymentStepIndicator.isDisplayed().catch(() => false)
  }

  async isOnReviewStep(): Promise<boolean> {
    return this.reviewStepIndicator.isDisplayed().catch(() => false)
  }

  async completeAddressStep(data: CheckoutAddressData): Promise<void> {
    await this.fillAddressFields(data)
    await this.tapNext()
    await this.paymentStepIndicator.waitForDisplayed({ timeout: 10_000 })
  }

  async submitAddressStep(data: CheckoutAddressData): Promise<void> {
    await this.fillAddressFields(data)
    await this.tapNext()
  }

  async completePaymentStep(data: CheckoutPaymentData): Promise<void> {
    await this.fillPaymentFields(data)
    await this.tapNext()
    await this.reviewStepIndicator.waitForDisplayed({ timeout: 10_000 })
  }

  async submitPaymentStep(data: CheckoutPaymentData): Promise<void> {
    await this.fillPaymentFields(data)
    await this.tapNext()
  }

  async placeOrder(): Promise<void> {
    await this.reviewStepIndicator.waitForDisplayed({ timeout: 10_000 })
    await this.placeOrderButton.waitForDisplayed({ timeout: 5_000 })
    await this.placeOrderButton.click()
  }

  async placeOrderAndWaitForConfirmation(): Promise<void> {
    await this.placeOrder()
    await this.orderConfirmation.waitForDisplayed({ timeout: 15_000 })
  }

  async isOrderConfirmationDisplayed(timeoutMs = 5_000): Promise<boolean> {
    return this.orderConfirmation
      .waitForDisplayed({ timeout: timeoutMs })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Reads the dynamic order id from confirmation copy, e.g.
   * "Your order ORD-2026-004 has been placed successfully."
   */
  async getConfirmedOrderId(): Promise<string> {
    await this.orderConfirmation.waitForDisplayed({ timeout: 5_000 })
    const confirmationDesc =
      (await this.orderConfirmation.getAttribute('content-desc')) ?? ''
    const fromConfirmation = confirmationDesc.match(/ORD-\d{4}-\d+/i)
    if (fromConfirmation) {
      return fromConfirmation[0].toUpperCase()
    }

    const message = $(CHECKOUT_LOCATORS.confirmedOrderMessage)
    await message.waitForDisplayed({ timeout: 5_000 })
    const desc = (await message.getAttribute('content-desc')) ?? ''
    const match = desc.match(/ORD-\d{4}-\d+/i)
    if (!match) {
      throw new Error(`Could not parse confirmed order id from: "${desc}"`)
    }
    return match[0].toUpperCase()
  }

  async continueShopping(): Promise<void> {
    const button = $(CHECKOUT_LOCATORS.continueShoppingButton)
    await button.waitForDisplayed({ timeout: 5_000 })
    await button.click()
  }

  async hasValidationError(text: string, timeoutMs = 5_000): Promise<boolean> {
    return $(CHECKOUT_LOCATORS.errorMessage(text))
      .waitForDisplayed({ timeout: timeoutMs })
      .then(() => true)
      .catch(() => false)
  }

  async hasAnyValidationError(timeoutMs = 5_000): Promise<boolean> {
    return $(CHECKOUT_LOCATORS.anyErrorMessage)
      .waitForDisplayed({ timeout: timeoutMs })
      .then(() => true)
      .catch(() => false)
  }

  async isPaymentDeclinedDisplayed(timeoutMs = 8_000): Promise<boolean> {
    return this.paymentDeclined
      .waitForDisplayed({ timeout: timeoutMs })
      .then(() => true)
      .catch(() => false)
  }

  private async fillAddressFields(data: CheckoutAddressData): Promise<void> {
    await this.addressStepIndicator.waitForDisplayed({ timeout: 10_000 })
    await this.fillTextField(this.fullNameField, data.fullName)
    await this.fillTextField(this.phoneField, data.phone)
    await this.fillTextField(this.addressField, data.address)
    await this.fillTextField(this.cityField, data.city)
    await this.fillTextField(this.stateField, data.state)
    await this.fillTextField(this.zipCodeField, data.zipCode)
    await this.hideKeyboardIfShown()
  }

  private async fillPaymentFields(data: CheckoutPaymentData): Promise<void> {
    await this.paymentStepIndicator.waitForDisplayed({ timeout: 10_000 })
    await this.fillTextField(this.cardNumberField, data.cardNumber)
    await this.fillTextField(this.expiryField, data.expiry)
    await this.fillTextField(this.cvvField, data.cvv)
    await this.hideKeyboardIfShown()
  }

  private async tapNext(): Promise<void> {
    await this.waitFor(this.nextButton, 5_000)
    await this.nextButton.click()
  }
}
