import { BaseScreen } from '../support/base.screen'
import { APP_PACKAGE, MAIN_ACTIVITY } from '../config/app.constants'

export class HomeScreen extends BaseScreen {
  async waitUntilLoaded(timeoutMs = 20_000): Promise<void> {
    await browser.waitUntil(async () => this.isLoaded(), {
      timeout: timeoutMs,
      timeoutMsg: `Expected ${APP_PACKAGE}/${MAIN_ACTIVITY} to be in foreground`,
      interval: 500,
    })
  }

  async isLoaded(): Promise<boolean> {
    const pkg = await driver.getCurrentPackage()
    if (pkg !== APP_PACKAGE) return false
    const activity = await driver.getCurrentActivity()
    return activity.includes('MainActivity')
  }

  async hasRenderedUi(): Promise<boolean> {
    const source = await driver.getPageSource()
    if (source.length < 200) return false
    if (!source.includes('<hierarchy')) return false
    // The foreground hierarchy must belong to the QA-Lab app itself, not a
    // system overlay. Without this check, a "Pixel Launcher isn't responding"
    // ANR dialog (package="android") would pass the smoke as a false positive.
    return source.includes(APP_PACKAGE)
  }
}
