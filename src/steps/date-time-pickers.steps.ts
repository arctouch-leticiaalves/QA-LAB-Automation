import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Date & Time Pickers scenario$/, async function () {
  this.dateTimePickers = await this.additionalTests.openDateTimePickers()
})

When(/^the user selects day 15 of the next month$/, async function () {
  this.selectedDate = this.dateTimePickers.getNextMonthDate()
  await this.dateTimePickers.selectDateInNextMonth(this.selectedDate)
})

Then(/^the selected date should be displayed$/, async function () {
  expect(await this.dateTimePickers.isDateSelected(this.selectedDate)).toBe(true)
})
