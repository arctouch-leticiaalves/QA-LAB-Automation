import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { TIME_PICKERS_LOCATORS } from '../locators/time-picker.locators'

export class TimePickerScreen extends BaseScreen {
  private get pickTimeButton(): ChainablePromiseElement {
    return $(TIME_PICKERS_LOCATORS.pickTimeButton)
  }

  private get switchToTextInputButton(): ChainablePromiseElement {
    return $(TIME_PICKERS_LOCATORS.switchToTextInput)
  }

  private get enterTimeLabel(): ChainablePromiseElement {
    return $(TIME_PICKERS_LOCATORS.enterTimeLabel)
  }

  private get hourInput(): ChainablePromiseElement {
    return $(TIME_PICKERS_LOCATORS.hourInput)
  }

  private get minuteInput(): ChainablePromiseElement {
    return $(TIME_PICKERS_LOCATORS.minuteInput)
  }

  private get amButton(): ChainablePromiseElement {
    return $(TIME_PICKERS_LOCATORS.amButton)
  }

  private get pmButton(): ChainablePromiseElement {
    return $(TIME_PICKERS_LOCATORS.pmButton)
  }

  private get confirmButton(): ChainablePromiseElement {
    return $(TIME_PICKERS_LOCATORS.confirmButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.pickTimeButton.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.pickTimeButton.isDisplayed().catch(() => false)
  }

  toDisplayTime(hour: string, minute: string, period: 'AM' | 'PM'): string {
    return `${Number(hour)}:${minute} ${period}`
  }

  async selectTime(
    hour: string,
    minute: string,
    period: 'AM' | 'PM',
  ): Promise<void> {
    await this.pickTimeButton.click()
    await this.switchToTextInputButton.waitForDisplayed({ timeout: 5_000 })
    await this.switchToTextInputButton.click()
    await this.enterTimeLabel.waitForDisplayed({ timeout: 5_000 })

    await this.setPickerField(this.hourInput, hour)
    await this.setPickerField(this.minuteInput, minute)

    await (period === 'AM' ? this.amButton : this.pmButton).click()
    await this.confirmButton.click()
  }

  async isTimeSelected(time: string): Promise<boolean> {
    const selectedTime = $(TIME_PICKERS_LOCATORS.selectedTime(time))
    return selectedTime.isDisplayed().catch(() => false)
  }

  private async setPickerField(
    field: ChainablePromiseElement,
    value: string,
  ): Promise<void> {
    await field.waitForDisplayed({ timeout: 5_000 })
    await field.click()
    await field.clearValue()
    await field.setValue(value)
  }
}
