import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'
import { ShopScreen } from '../screens/shop.screen'
import { SettingsScreen } from '../screens/settings.screen'

const app = new AppActions()

Given(/^the user is on the settings screen$/, async function () {
  await app.clearData()
  await app.launch()

  this.login = new LoginScreen()
  await this.login.waitUntilLoaded()
  await this.login.submitForm('testing@arctouch.com', 'QA1234')

  this.shop = new ShopScreen()
  await this.shop.waitUntilLoaded()

  this.settings = new SettingsScreen()
  await this.settings.openFromNavBar()
})

When(/^the user opens Additional Tests$/, async function () {
  this.additionalTests = await this.settings.openAdditionalTests()
})

When(/^the user opens the Drag & Drop scenario$/, async function () {
  this.dragDrop = await this.additionalTests.openDragDrop()
})

When(/^the user drags Item 1 below Item 3$/, async function () {
  await this.dragDrop.dragItemBelowItem('Item 1', 'Item 3')
})

Then(/^the additional tests screen should be displayed$/, async function () {
  expect(await this.additionalTests.isLoaded()).toBe(true)
})

Then(/^the gesture test scenarios should be visible$/, async function () {
  expect(await this.additionalTests.isGestureSectionVisible()).toBe(true)
})

Then(/^the widget test scenarios should be visible$/, async function () {
  expect(await this.additionalTests.isWidgetSectionVisible()).toBe(true)
})

Then(/^the drag and drop screen should be displayed$/, async function () {
  expect(await this.dragDrop.isLoaded()).toBe(true)
})

Then(/^the list should show 8 draggable items$/, async function () {
  expect(await this.dragDrop.getDraggableItemCount()).toBe(
    this.dragDrop.getExpectedItemCount(),
  )
})

Then(/^the order display should show the default item sequence$/, async function () {
  expect(await this.dragDrop.hasDefaultOrder()).toBe(true)
})

Then(/^the order display should show Item 2 before Item 1$/, async function () {
  expect(await this.dragDrop.isItemBefore('Item 2', 'Item 1')).toBe(true)
})
