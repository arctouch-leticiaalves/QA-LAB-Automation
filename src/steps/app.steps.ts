import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { HomeScreen } from '../screens/home.screen'

const app = new AppActions()

Given(/^the device has the QA-Lab app installed$/, async () => {
  const installed = await app.isInstalled()
  if (!installed) {
    throw new Error(
      `Precondition failed: package ${app.packageName} is not installed on the device`,
    )
  }
})

When(/^the QA-Lab app is launched$/, async function () {
  await app.launch()
  this.home = new HomeScreen() 
  await this.home.waitUntilLoaded()
})

Then(/^the main activity should be in the foreground$/, async function () {
  expect(await app.getCurrentPackage()).toBe(app.packageName)
  expect(await this.home.isLoaded()).toBe(true)
})

Then(/^the app UI tree should be rendered$/, async function () {
  expect(await this.home.hasRenderedUi()).toBe(true)
})
