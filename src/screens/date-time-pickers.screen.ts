import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { DATE_TIME_PICKERS_LOCATORS } from '../locators/date-time-pickers.locators'

const TARGET_DAY = 15

export class DateTimePickersScreen extends BaseScreen {
  private get dateTimePickersTitle(): ChainablePromiseElement {
    return $(DATE_TIME_PICKERS_LOCATORS.dateTimePickersTitle)
  }

  private get datePickerCard(): ChainablePromiseElement {
    return $(DATE_TIME_PICKERS_LOCATORS.datePickerCard)
  }

  private get pickDateButton(): ChainablePromiseElement {
    return $(DATE_TIME_PICKERS_LOCATORS.pickDateButton)
  }

  private get nextMonthButton(): ChainablePromiseElement {
    return $(DATE_TIME_PICKERS_LOCATORS.nextMonthButton)
  }

  private get confirmButton(): ChainablePromiseElement {
    return $(DATE_TIME_PICKERS_LOCATORS.confirmButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.dateTimePickersTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.datePickerCard.waitForDisplayed({ timeout: timeoutMs })
    await this.pickDateButton.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.dateTimePickersTitle.isDisplayed().catch(() => false)
  }

  getNextMonthDate(): Date {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth() + 1, TARGET_DAY)
  }

  async selectDateInNextMonth(date: Date): Promise<void> {
    await this.pickDateButton.click()
    await this.nextMonthButton.waitForDisplayed({ timeout: 5_000 })
    await this.nextMonthButton.click()

    const day = $(DATE_TIME_PICKERS_LOCATORS.calendarDay(this.toAccessibleDate(date)))
    await day.waitForDisplayed({ timeout: 5_000 })
    await day.click()
    await this.confirmButton.click()
  }

  async isDateSelected(date: Date): Promise<boolean> {
    const selectedDate = $(DATE_TIME_PICKERS_LOCATORS.selectedDate(this.toDisplayDate(date)))
    return selectedDate.isDisplayed().catch(() => false)
  }

  private toAccessibleDate(date: Date): string {
    const fullDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)

    return `${date.getDate()}, ${fullDate}`
  }

  private toDisplayDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}/${day}/${date.getFullYear()}`
  }
}
