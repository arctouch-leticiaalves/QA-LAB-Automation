import { When, Then } from '@wdio/cucumber-framework'

When(/^the user taps Reset App$/, async function () {
  await this.settings.tapResetApp()
})

When(/^the user confirms reset app$/, async function () {
  this.login = await this.settings.confirmResetApp()
})

When(/^the user cancels reset app$/, async function () {
  await this.settings.cancelResetApp()
})

Then(/^the reset app confirmation dialog should be displayed$/, async function () {
  expect(await this.settings.isResetAppConfirmationDisplayed()).toBe(true)
})

Then(
  /^the reset app confirmation dialog should not be displayed$/,
  async function () {
    expect(await this.settings.isResetAppConfirmationDisplayed()).toBe(false)
  },
)

Then(/^the reset app success toast should be displayed$/, async function () {
  expect(await this.settings.isResetSuccessToastDisplayed()).toBe(true)
})
