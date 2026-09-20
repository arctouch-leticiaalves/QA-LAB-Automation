import { When, Then } from '@wdio/cucumber-framework'

When(/^the user taps Logout$/, async function () {
  await this.settings.tapLogout()
})

When(/^the user confirms logout$/, async function () {
  this.login = await this.settings.confirmLogout()
})

When(/^the user cancels logout$/, async function () {
  await this.settings.cancelLogout()
})

Then(/^the logout confirmation dialog should be displayed$/, async function () {
  expect(await this.settings.isLogoutConfirmationDisplayed()).toBe(true)
})

Then(/^the logout confirmation dialog should not be displayed$/, async function () {
  expect(await this.settings.isLogoutConfirmationDisplayed()).toBe(false)
})

Then(/^the settings screen should still be displayed$/, async function () {
  expect(await this.settings.isLoaded()).toBe(true)
})
