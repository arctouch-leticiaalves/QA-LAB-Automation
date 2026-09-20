import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Dropdown Menus scenario$/, async function () {
  this.dropdownMenus = await this.additionalTests.openDropdownMenus()
})

When(/^the user selects (.+) from the country dropdown$/, async function (
  country: string,
) {
  await this.dropdownMenus.selectCountryFromDropdown(country)
})

When(/^the user selects (.+) from the sort popup$/, async function (
  optionKey: string,
) {
  await this.dropdownMenus.selectSortOption(optionKey)
})

When(
  /^the user types (.+) in the country autocomplete and chooses (.+)$/,
  async function (query: string, country: string) {
    await this.dropdownMenus.searchAndSelectCountry(query, country)
  },
)

Then(/^the dropdown menus screen should be displayed$/, async function () {
  expect(await this.dropdownMenus.isLoaded()).toBe(true)
})

Then(/^the country dropdown should show no selection$/, async function () {
  expect(await this.dropdownMenus.isCountryDropdownEmpty()).toBe(true)
})

Then(/^the sort popup should show no selection$/, async function () {
  expect(await this.dropdownMenus.isSortPopupEmpty()).toBe(true)
})

Then(/^the country autocomplete should show no selection$/, async function () {
  expect(await this.dropdownMenus.isCountryAutocompleteEmpty()).toBe(true)
})

Then(/^the country dropdown should show (.+) selected$/, async function (
  country: string,
) {
  expect(await this.dropdownMenus.isCountryDropdownSelected(country)).toBe(true)
})

Then(/^the sort popup should show (.+) selected$/, async function (
  optionKey: string,
) {
  expect(await this.dropdownMenus.isSortPopupSelected(optionKey)).toBe(true)
})

Then(/^the country autocomplete should show (.+) selected$/, async function (
  country: string,
) {
  expect(await this.dropdownMenus.isCountryAutocompleteSelected(country)).toBe(
    true,
  )
})
