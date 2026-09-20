import { When, Then } from '@wdio/cucumber-framework'
import { MULTI_SELECT_ITEMS } from '../locators/multi-select.locators'

When(/^the user opens the Multi-Select scenario$/, async function () {
  this.multiSelect = await this.additionalTests.openMultiSelect()
})

When(/^the user selects Annual Report\.pdf$/, async function () {
  await this.multiSelect.selectItem(MULTI_SELECT_ITEMS.annualReport)
})

When(/^the user selects Budget_2026\.xlsx$/, async function () {
  await this.multiSelect.selectItem(MULTI_SELECT_ITEMS.budget)
})

When(/^the user taps Select All$/, async function () {
  await this.multiSelect.tapSelectAll()
})

Then(/^the multi-select screen should be displayed$/, async function () {
  expect(await this.multiSelect.isLoaded()).toBe(true)
})

Then(/^(\d+) items should be selected$/, async function (count: string) {
  expect(await this.multiSelect.getSelectedCount()).toBe(Number(count))
})

Then(/^Annual Report\.pdf should be selected$/, async function () {
  expect(
    await this.multiSelect.isItemSelected(MULTI_SELECT_ITEMS.annualReport),
  ).toBe(true)
})

Then(/^Budget_2026\.xlsx should be selected$/, async function () {
  expect(
    await this.multiSelect.isItemSelected(MULTI_SELECT_ITEMS.budget),
  ).toBe(true)
})

Then(/^the Deselect All button should be displayed$/, async function () {
  expect(await this.multiSelect.isDeselectAllDisplayed()).toBe(true)
})
