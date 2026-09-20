import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { TIMER_STOPWATCH_LOCATORS } from '../locators/timer-stopwatch.locators'

/**
 * Flutter stopwatch emits continuous accessibility events while running.
 * UiAutomator2's default waitForIdleTimeout (10s) hangs finds/clicks, and even
 * with idle wait disabled the nested FAB Button can vanish mid-run. Cache the
 * center-control coordinates while Ready and tap them with clickGesture.
 * @see https://github.com/appium/appium-uiautomator2-driver#settings-api
 */
export class TimerStopwatchScreen extends BaseScreen {
  private centerTap: { x: number; y: number } | null = null

  private get timerStopwatchTitle(): ChainablePromiseElement {
    return $(TIMER_STOPWATCH_LOCATORS.timerStopwatchTitle)
  }

  private get elapsedTime(): ChainablePromiseElement {
    return $(TIMER_STOPWATCH_LOCATORS.elapsedTime)
  }

  private get resetFabButton(): ChainablePromiseElement {
    return $(TIMER_STOPWATCH_LOCATORS.resetFabButton)
  }

  async waitUntilLoaded(timeoutMs = 10_000): Promise<void> {
    await driver.updateSettings({ waitForIdleTimeout: 0 })
    await this.timerStopwatchTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.elapsedTime.waitForDisplayed({ timeout: timeoutMs })
    await $(TIMER_STOPWATCH_LOCATORS.readyStatus).waitForDisplayed({
      timeout: timeoutMs,
    })

    const center = $(TIMER_STOPWATCH_LOCATORS.centerControl)
    await center.waitForDisplayed({ timeout: timeoutMs })
    const { x, y } = await center.getLocation()
    const { width, height } = await center.getSize()
    this.centerTap = {
      x: Math.round(x + width / 2),
      y: Math.round(y + height / 2),
    }
  }

  async isLoaded(): Promise<boolean> {
    return this.timerStopwatchTitle.isDisplayed().catch(() => false)
  }

  async isReady(): Promise<boolean> {
    return $(TIMER_STOPWATCH_LOCATORS.readyStatus)
      .isDisplayed()
      .catch(() => false)
  }

  async isRunning(): Promise<boolean> {
    return $(TIMER_STOPWATCH_LOCATORS.runningStatus)
      .isDisplayed()
      .catch(() => false)
  }

  async isPaused(): Promise<boolean> {
    return $(TIMER_STOPWATCH_LOCATORS.pausedStatus)
      .isDisplayed()
      .catch(() => false)
  }

  async getElapsedDisplay(): Promise<string> {
    await this.elapsedTime.waitForDisplayed({ timeout: 3_000 })
    const desc =
      (await this.elapsedTime.getAttribute('content-desc')) ?? ''
    const match = desc.match(/Elapsed time:\s*([0-9:.]+)/u)
    if (!match) {
      throw new Error(`Could not parse elapsed time from: "${desc}"`)
    }
    return match[1]
  }

  async start(): Promise<void> {
    await this.tapCenterControl()
    await $(TIMER_STOPWATCH_LOCATORS.runningStatus).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async pause(): Promise<void> {
    await this.tapCenterControl()
    await $(TIMER_STOPWATCH_LOCATORS.pausedStatus).waitForDisplayed({
      timeout: 5_000,
    })
  }

  async reset(): Promise<void> {
    await this.waitFor(this.resetFabButton, 5_000)
    await this.resetFabButton.click()
    await $(TIMER_STOPWATCH_LOCATORS.readyStatus).waitForDisplayed({
      timeout: 5_000,
    })
  }

  private async tapCenterControl(): Promise<void> {
    if (!this.centerTap) {
      throw new Error('Center control coordinates were not cached on load')
    }
    await driver.execute('mobile: clickGesture', this.centerTap)
  }
}
