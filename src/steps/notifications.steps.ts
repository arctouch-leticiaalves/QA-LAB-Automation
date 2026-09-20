import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Notifications scenario$/, async function () {
  this.notifications = await this.additionalTests.openNotifications()
})

When(/^the user shows the persistent banner$/, async function () {
  await this.notifications.showPersistentBanner()
})

Then(/^the notifications screen should be displayed$/, async function () {
  expect(await this.notifications.isLoaded()).toBe(true)
})

Then(/^the event log should be empty$/, async function () {
  expect(await this.notifications.isEventLogEmpty()).toBe(true)
})

Then(/^the persistent banner event should be logged$/, async function () {
  expect(await this.notifications.isPersistentBannerLogged()).toBe(true)
})
