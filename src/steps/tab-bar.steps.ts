import { When, Then } from '@wdio/cucumber-framework'
import { TAB_BAR_TABS } from '../locators/tab-bar.locators'

When(/^the user opens the Tab Bar scenario$/, async function () {
  this.tabBar = await this.additionalTests.openTabBar()
})

When(/^the user opens the Explore tab$/, async function () {
  await this.tabBar.openTab(TAB_BAR_TABS.explore.name, TAB_BAR_TABS.explore.index)
})

Then(/^the tab bar screen should be displayed$/, async function () {
  expect(await this.tabBar.isLoaded()).toBe(true)
})

Then(/^the Home tab should be visible$/, async function () {
  expect(await this.tabBar.isTabVisible(TAB_BAR_TABS.home.index)).toBe(true)
})

Then(/^the Explore tab should be visible$/, async function () {
  expect(await this.tabBar.isTabVisible(TAB_BAR_TABS.explore.index)).toBe(true)
})

Then(/^the active tab should be (\d+) of 4$/, async function (index: string) {
  expect(await this.tabBar.getActiveTabIndex()).toBe(Number(index))
})

Then(/^the Home tab content should be displayed$/, async function () {
  expect(await this.tabBar.isTabContentDisplayed(TAB_BAR_TABS.home.name)).toBe(
    true,
  )
})

Then(/^the Explore tab content should be displayed$/, async function () {
  expect(
    await this.tabBar.isTabContentDisplayed(TAB_BAR_TABS.explore.name),
  ).toBe(true)
})
