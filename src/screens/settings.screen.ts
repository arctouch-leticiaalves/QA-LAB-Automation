import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { SETTINGS_LOCATORS } from '../locators/settings.locators'
import { AdditionalTestsScreen } from './additional-tests.screen'
import { LoginScreen } from './login.screen'

export class SettingsScreen extends BaseScreen {
  private get settingsTitle(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.settingsTitle)
  }

  private get settingsTab(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.settingsTab)
  }

  private get additionalTestsButton(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.additionalTestsButton)
  }

  private get resetAppButton(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.resetAppButton)
  }

  private get resetAppDialogTitle(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.resetAppDialogTitle)
  }

  private get cancelResetButton(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.cancelResetButton)
  }

  private get confirmResetButton(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.confirmResetButton)
  }

  private get resetSuccessToast(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.resetSuccessToast)
  }

  private get logoutButton(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.logoutButton)
  }

  private get logoutDialogTitle(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.logoutDialogTitle)
  }

  private get cancelLogoutButton(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.cancelLogoutButton)
  }

  private get confirmLogoutButton(): ChainablePromiseElement {
    return $(SETTINGS_LOCATORS.confirmLogoutButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.settingsTitle.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.settingsTitle.isDisplayed().catch(() => false)
  }

  async openFromNavBar(): Promise<void> {
    await this.waitFor(this.settingsTab, 5_000)
    await this.settingsTab.click()
    await this.waitUntilLoaded()
  }

  async openAdditionalTests(): Promise<AdditionalTestsScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Additional tests button")',
    )
    await this.waitFor(this.additionalTestsButton, 5_000)
    await this.additionalTestsButton.click()
    const additionalTests = new AdditionalTestsScreen()
    await additionalTests.waitUntilLoaded()
    return additionalTests
  }

  async tapResetApp(): Promise<void> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Reset app to factory defaults")',
    )
    await this.waitFor(this.resetAppButton, 5_000)
    await this.resetAppButton.click()
    await this.resetAppDialogTitle.waitForDisplayed({ timeout: 5_000 })
  }

  async isResetAppConfirmationDisplayed(): Promise<boolean> {
    return this.resetAppDialogTitle.isDisplayed().catch(() => false)
  }

  async cancelResetApp(): Promise<void> {
    await this.waitFor(this.cancelResetButton, 5_000)
    await this.cancelResetButton.click()
    await this.resetAppDialogTitle.waitForDisplayed({
      timeout: 5_000,
      reverse: true,
    })
  }

  async confirmResetApp(): Promise<LoginScreen> {
    await this.waitFor(this.confirmResetButton, 5_000)
    await this.confirmResetButton.click()
    const login = new LoginScreen()
    await login.waitUntilLoaded()
    return login
  }

  async isResetSuccessToastDisplayed(timeoutMs = 8_000): Promise<boolean> {
    return this.resetSuccessToast
      .waitForDisplayed({ timeout: timeoutMs })
      .then(() => true)
      .catch(() => false)
  }

  async tapLogout(): Promise<void> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Logout button")',
    )
    await this.waitFor(this.logoutButton, 5_000)
    await this.logoutButton.click()
    await this.logoutDialogTitle.waitForDisplayed({ timeout: 5_000 })
  }

  async isLogoutConfirmationDisplayed(): Promise<boolean> {
    return this.logoutDialogTitle.isDisplayed().catch(() => false)
  }

  async cancelLogout(): Promise<void> {
    await this.waitFor(this.cancelLogoutButton, 5_000)
    await this.cancelLogoutButton.click()
    await this.logoutDialogTitle.waitForDisplayed({
      timeout: 5_000,
      reverse: true,
    })
  }

  async confirmLogout(): Promise<LoginScreen> {
    await this.waitFor(this.confirmLogoutButton, 5_000)
    await this.confirmLogoutButton.click()
    const login = new LoginScreen()
    await login.waitUntilLoaded()
    return login
  }
}
