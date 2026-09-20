import { When, Then } from '@wdio/cucumber-framework'
import { DateRangePickerScreen } from '../screens/date-range-picker.screen'

Then(/^the date range picker should be displayed$/, async function () {
  this.dateRangePicker = new DateRangePickerScreen()
  await this.dateRangePicker.waitUntilLoaded()
  expect(await this.dateRangePicker.isLoaded()).toBe(true)
})

When(
  /^the user selects a date range from day (\d+) to day (\d+) of the next month$/,
  async function (startDay: string, endDay: string) {
    this.dateRangePicker = new DateRangePickerScreen()
    const today = new Date()
    this.selectedDateRange = {
      start: new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        Number(startDay),
      ),
      end: new Date(today.getFullYear(), today.getMonth() + 1, Number(endDay)),
    }
    await this.dateRangePicker.selectRangeInNextMonth(
      this.selectedDateRange.start,
      this.selectedDateRange.end,
    )
  },
)

Then(/^the selected date range should be displayed$/, async function () {
  expect(
    await this.dateRangePicker.isRangeSelected(
      this.selectedDateRange.start,
      this.selectedDateRange.end,
    ),
  ).toBe(true)
})
