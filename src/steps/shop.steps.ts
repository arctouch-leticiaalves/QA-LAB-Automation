import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'
import { ShopScreen } from '../screens/shop.screen'

const app = new AppActions()

Given(/^the user is on the shop screen$/, async function () {
  await app.terminate()
  await app.launch()
  this.login = new LoginScreen()
  await this.login.waitUntilLoaded()
  await this.login.submitForm('testing@arctouch.com', 'QA1234')
  this.shop = new ShopScreen()
  await this.shop.waitUntilLoaded()
})

Then(/^the shop should display a list of products$/, async function () {
  expect(await this.shop.isLoaded()).toBe(true)
})

Then(/^the counter should show the number of visible products$/, async function () {
  const value = await this.shop.getProductsCounterText()
  expect(value).toMatch(/Showing \d+ of \d+ products/)
})

When(/^the user filters by the Electronics category$/, async function () {
  await this.shop.tapCategoryChip('Electronics')
})

Then(/^the counter should show 8 of 8 products$/, async function () {
  const value = await this.shop.getProductsCounterText()
  expect(value).toContain('Showing 8 of 8 products')
})

Then(/^the counter should reflect the filtered product count$/, async function () {
  const value = await this.shop.getProductsCounterText()
  expect(value).toMatch(/Showing \d+ of \d+ products/)
})

Then(/^the Electronics category chip should be selected$/, async function () {
  expect(await this.shop.isCategoryChipSelected('Electronics')).toBe(true)
})

When(/^the user resets the filter to All$/, async function () {
  await this.shop.tapCategoryChip('All')
})

Then(/^the counter should show all 30 products$/, async function () {
  const value = await this.shop.getProductsCounterText()
  expect(value).toContain('of 30 products')
})

When(/^the user searches for (.+)$/, async function (query: string) {
  await this.shop.search(query)
})

Then(/^no products should be displayed in the shop$/, async function () {
  expect(await this.shop.hasNoProducts()).toBe(true)
})

When(/^the user taps the first product in the list$/, async function () {
  this.productDetail = await this.shop.tapFirstProduct()
})

Then(/^the user should be navigated to the product detail screen$/, async function () {
  expect(await this.productDetail.isLoaded()).toBe(true)
})
