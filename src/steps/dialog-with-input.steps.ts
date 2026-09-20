import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Dialog with Input scenario$/, async function () {
  this.dialogWithInput = await this.additionalTests.openDialogWithInput()
})

When(/^the user opens the text input dialog$/, async function () {
  await this.dialogWithInput.openTextDialog()
})

When(
  /^the user submits the name (.+) in the text dialog$/,
  async function (name: string) {
    await this.dialogWithInput.submitName(name)
  },
)

Then(/^the dialog with input screen should be displayed$/, async function () {
  expect(await this.dialogWithInput.isLoaded()).toBe(true)
})

Then(
  /^the submitted name (.+) should be displayed$/,
  async function (name: string) {
    expect(await this.dialogWithInput.isSubmittedNameDisplayed(name)).toBe(
      true,
    )
  },
)
