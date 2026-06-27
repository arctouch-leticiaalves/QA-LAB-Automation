import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'
import { ShopScreen } from '../screens/shop.screen'

const app = new AppActions()

Given(/^the user is on the login screen$/, async function () {
  await app.terminate()
  await app.launch()
  this.login = new LoginScreen()
  await this.login.waitUntilLoaded()
})

When(
  /^the user submits the login form with (\S*) and (\S*)$/,
  async function (email: string, password: string) {
    await this.login.submitForm(email, password)
  },
)

When(/^the user submits the login form without typing anything$/, async function () {
  await this.login.submitForm('', '')
})

Then(/^the user should be navigated to the shop screen$/, async function () {
  this.shop = new ShopScreen()
  await this.shop.waitUntilLoaded()
  expect(await this.shop.isLoaded()).toBe(true)
  expect(await this.login.isLoaded()).toBe(false)
})

Then(/^the login screen should still be displayed$/, async function () {
  expect(await this.login.isLoaded()).toBe(true)
})

Then(/^a login error indicator should be visible$/, async function () {
  await browser.waitUntil(async () => this.login.hasErrorIndicator(), {
    timeout: 5_000,
    timeoutMsg: 'Expected a visible error indicator after invalid login',
    interval: 500,
  })
  expect(await this.login.hasErrorIndicator()).toBe(true)
})
