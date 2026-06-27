import { APP_PACKAGE } from '../config/app.constants'

export class AppActions {
  readonly packageName: string = APP_PACKAGE

  async isInstalled(): Promise<boolean> {
    return driver.isAppInstalled(this.packageName)
  }

  async launch(): Promise<void> {
    await driver.activateApp(this.packageName)
  }

  async terminate(): Promise<void> {
    await driver.terminateApp(this.packageName)
  }

  async restart(): Promise<void> {
    await this.terminate()
    await this.launch()
  }

  async getCurrentPackage(): Promise<string> {
    return driver.getCurrentPackage()
  }

  async getCurrentActivity(): Promise<string> {
    return driver.getCurrentActivity()
  }
}
