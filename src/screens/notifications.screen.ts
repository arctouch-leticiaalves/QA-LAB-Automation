import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { NOTIFICATIONS_LOCATORS } from '../locators/notifications.locators'

export class NotificationsScreen extends BaseScreen {
  private get notificationsTitle(): ChainablePromiseElement {
    return $(NOTIFICATIONS_LOCATORS.notificationsTitle)
  }

  private get showBannerButton(): ChainablePromiseElement {
    return $(NOTIFICATIONS_LOCATORS.showBannerButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.notificationsTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.showBannerButton.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.notificationsTitle.isDisplayed().catch(() => false)
  }

  async isEventLogEmpty(): Promise<boolean> {
    return $(NOTIFICATIONS_LOCATORS.eventLogEmpty)
      .isDisplayed()
      .catch(() => false)
  }

  async showPersistentBanner(): Promise<void> {
    await this.waitFor(this.showBannerButton, 5_000)
    await this.showBannerButton.click()
    await $(NOTIFICATIONS_LOCATORS.showedPersistentBanner).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async isPersistentBannerLogged(): Promise<boolean> {
    return $(NOTIFICATIONS_LOCATORS.showedPersistentBanner)
      .isDisplayed()
      .catch(() => false)
  }

  async isBannerMessageDisplayed(): Promise<boolean> {
    const messageVisible = await $(NOTIFICATIONS_LOCATORS.persistentBannerMessage)
      .isDisplayed()
      .catch(() => false)
    const bannerVisible = await $(NOTIFICATIONS_LOCATORS.bannerVisible)
      .isDisplayed()
      .catch(() => false)
    return messageVisible || bannerVisible
  }
}
