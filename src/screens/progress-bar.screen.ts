import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { PROGRESS_BAR_LOCATORS } from '../locators/progress-bar.locators'

export class ProgressBarScreen extends BaseScreen {
  private get progressBarTitle(): ChainablePromiseElement {
    return $(PROGRESS_BAR_LOCATORS.progressBarTitle)
  }

  private get startDownloadButton(): ChainablePromiseElement {
    return $(PROGRESS_BAR_LOCATORS.startDownloadButton)
  }

  private get resetButton(): ChainablePromiseElement {
    return $(PROGRESS_BAR_LOCATORS.resetButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.progressBarTitle.waitForDisplayed({ timeout: timeoutMs })
    await $(PROGRESS_BAR_LOCATORS.readyStatus).waitForDisplayed({
      timeout: timeoutMs,
    })
    await this.startDownloadButton.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.progressBarTitle.isDisplayed().catch(() => false)
  }

  async isReady(): Promise<boolean> {
    return $(PROGRESS_BAR_LOCATORS.readyStatus)
      .isDisplayed()
      .catch(() => false)
  }

  async getProgressPercent(): Promise<number> {
    for (let percent = 0; percent <= 100; percent++) {
      const visible = await $(PROGRESS_BAR_LOCATORS.progressLabel(percent))
        .isDisplayed()
        .catch(() => false)
      if (visible) {
        return percent
      }
    }
    throw new Error('Could not determine progress percent')
  }

  async startDownload(): Promise<void> {
    await this.waitFor(this.startDownloadButton, 5_000)
    await this.startDownloadButton.click()
  }

  async waitUntilComplete(timeoutMs = 15_000): Promise<void> {
    await $(PROGRESS_BAR_LOCATORS.downloadComplete).waitForDisplayed({
      timeout: timeoutMs,
    })
    await $(PROGRESS_BAR_LOCATORS.progressLabel(100)).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async isDownloadComplete(): Promise<boolean> {
    return $(PROGRESS_BAR_LOCATORS.downloadComplete)
      .isDisplayed()
      .catch(() => false)
  }

  async reset(): Promise<void> {
    await this.waitFor(this.resetButton, 5_000)
    await this.resetButton.click()
    await $(PROGRESS_BAR_LOCATORS.readyStatus).waitForDisplayed({
      timeout: 5_000,
    })
  }
}
