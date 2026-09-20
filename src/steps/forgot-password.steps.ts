import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'

const app = new AppActions()

Given(/^the user is on the forgot password screen$/, async function () {
  await app.terminate()
  await app.launch()
  this.login = new LoginScreen()
  await this.login.waitUntilLoaded()
  this.forgotPassword = await this.login.tapForgotPasswordLink()
})

When(
  /^the user submits the forgot password form with (.*)$/,
  async function (email: string) {
    await this.forgotPassword.submitEmail(email.trim())
  },
)

When(/^the user taps Back to Sign In$/, async function () {
  await this.forgotPassword.waitForSuccess()
  this.login = await this.forgotPassword.tapBackToSignIn()
})

Then(/^the reset link confirmation should be displayed$/, async function () {
  await this.forgotPassword.waitForSuccess()
  expect(await this.forgotPassword.isSuccessDisplayed()).toBe(true)
})

Then(
  /^the confirmation should mention (.+)$/,
  async function (email: string) {
    const message = await this.forgotPassword.getSuccessEmailMessage()
    expect(message).toContain(email)
  },
)

Then(/^the forgot password screen should still be displayed$/, async function () {
  expect(await this.forgotPassword.isLoaded()).toBe(true)
  expect(await this.forgotPassword.isSuccessDisplayed()).toBe(false)
})

Then(
  /^a forgot password error indicator should be visible$/,
  async function () {
    await browser.waitUntil(async () => this.forgotPassword.hasErrorIndicator(), {
      timeout: 5_000,
      timeoutMsg: 'Expected a visible error indicator after invalid forgot password submit',
      interval: 500,
    })
    expect(await this.forgotPassword.hasErrorIndicator()).toBe(true)
  },
)
