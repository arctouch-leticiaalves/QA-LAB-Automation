import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { DATE_RANGE_PICKER_LOCATORS } from '../locators/date-range-picker.locators'

export class DateRangePickerScreen extends BaseScreen {
  private get dateRangePickerCard(): ChainablePromiseElement {
    return $(DATE_RANGE_PICKER_LOCATORS.dateRangePickerCard)
  }

  private get pickRangeButton(): ChainablePromiseElement {
    return $(DATE_RANGE_PICKER_LOCATORS.pickRangeButton)
  }

  private get nextMonthButton(): ChainablePromiseElement {
    return $(DATE_RANGE_PICKER_LOCATORS.nextMonthButton)
  }

  private get saveButton(): ChainablePromiseElement {
    return $(DATE_RANGE_PICKER_LOCATORS.saveButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.dateRangePickerCard.waitForDisplayed({ timeout: timeoutMs })
    await this.pickRangeButton.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.pickRangeButton.isDisplayed().catch(() => false)
  }

  async selectRangeInNextMonth(start: Date, end: Date): Promise<void> {
    await this.pickRangeButton.click()
    await this.saveButton.waitForDisplayed({ timeout: 5_000 })

    // Material range calendars often show multiple months; advance when present.
    if (await this.nextMonthButton.isDisplayed().catch(() => false)) {
      await this.nextMonthButton.click()
    }

    const startDay = $(
      DATE_RANGE_PICKER_LOCATORS.calendarDay(this.toAccessibleDate(start)),
    )
    await startDay.waitForDisplayed({ timeout: 5_000 })
    await startDay.click()

    const endDay = $(
      DATE_RANGE_PICKER_LOCATORS.calendarDay(this.toAccessibleDate(end)),
    )
    await endDay.waitForDisplayed({ timeout: 5_000 })
    await endDay.click()

    await this.saveButton.click()
  }

  async isRangeSelected(start: Date, end: Date): Promise<boolean> {
    return $(
      DATE_RANGE_PICKER_LOCATORS.selectedRange(
        this.toDisplayDate(start),
        this.toDisplayDate(end),
      ),
    )
      .isDisplayed()
      .catch(() => false)
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
