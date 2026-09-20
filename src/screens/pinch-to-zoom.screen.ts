import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { PINCH_TO_ZOOM_LOCATORS } from '../locators/pinch-to-zoom.locators'

export class PinchToZoomScreen extends BaseScreen {
  private get pinchToZoomTitle(): ChainablePromiseElement {
    return $(PINCH_TO_ZOOM_LOCATORS.pinchToZoomTitle)
  }

  private get zoomLevel(): ChainablePromiseElement {
    return $(PINCH_TO_ZOOM_LOCATORS.zoomLevel)
  }

  private get resetZoomButton(): ChainablePromiseElement {
    return $(PINCH_TO_ZOOM_LOCATORS.resetZoomButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.pinchToZoomTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.zoomLevel.waitForDisplayed({ timeout: timeoutMs })
    await this.dismissHintIfShown()
  }

  async isLoaded(): Promise<boolean> {
    return this.pinchToZoomTitle.isDisplayed().catch(() => false)
  }

  async getZoomLevel(): Promise<number> {
    await this.zoomLevel.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.zoomLevel.getAttribute('content-desc')) ?? ''
    const match = desc.match(/Zoom level\s+([\d.]+)x/u)
    if (!match) {
      throw new Error(`Could not parse zoom level from: "${desc}"`)
    }
    return Number(match[1])
  }

  async pinchOpen(percent = 0.8): Promise<void> {
    await driver.execute('mobile: pinchOpenGesture', {
      ...this.zoomGestureArea(),
      percent,
    })
    await browser.pause(500)
  }

  async pinchClose(percent = 0.8): Promise<void> {
    await driver.execute('mobile: pinchCloseGesture', {
      ...this.zoomGestureArea(),
      percent,
    })
    await browser.pause(500)
  }

  async resetZoom(): Promise<void> {
    await this.waitFor(this.resetZoomButton, 5_000)
    await this.resetZoomButton.click()
    await browser.waitUntil(async () => (await this.getZoomLevel()) === 1, {
      timeout: 5_000,
      interval: 200,
      timeoutMsg: 'Expected zoom level to reset to 1.0x',
    })
  }

  private zoomGestureArea(): {
    left: number
    top: number
    width: number
    height: number
  } {
    // Matches the interactive grid region under the zoom label on Pixel_9.
    return { left: 120, top: 800, width: 840, height: 900 }
  }

  private async dismissHintIfShown(): Promise<void> {
    const hint = $(PINCH_TO_ZOOM_LOCATORS.dismissHintButton)
    const visible = await hint.isDisplayed().catch(() => false)
    if (!visible) return

    // Prefer the trailing close control on the hint banner.
    await driver.execute('mobile: clickGesture', { x: 941, y: 414 })
    await browser.pause(300)
  }
}
