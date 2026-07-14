import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'
import { ShopScreen } from '../screens/shop.screen'
import { CartScreen } from '../screens/cart.screen'

const app = new AppActions()

Given(/^the user is on the cart screen$/, async function () {
  await app.clearData()
  await app.launch()

  this.login = new LoginScreen()
  await this.login.waitUntilLoaded()
  await this.login.submitForm('testing@arctouch.com', 'QA1234')

  this.shop = new ShopScreen()
  await this.shop.waitUntilLoaded()

  this.cart = new CartScreen()
  await this.cart.openFromNavBar()
})

Then(/^the user should see an empty cart message$/, async function () {
  expect(await this.cart.isEmptyMessageVisible()).toBe(true)
})

Given(/^the user adds the first product to the cart from the shop$/, async function () {
  const shop = await this.cart.tapBrowseProducts()
  const detail = await shop.tapFirstProduct()
  await detail.tapAddToCart()
  await detail.goBack()
})

When(/^the user navigates to the cart$/, async function () {
  await this.cart.openFromNavBar()
})

Then(/^the product should be displayed in the cart$/, async function () {
  expect(await this.cart.hasItems()).toBe(true)
})

Given(/^the user has a product in the cart$/, async function () {
  const shop = await this.cart.tapBrowseProducts()
  const detail = await shop.tapFirstProduct()
  await detail.tapAddToCart()
  await detail.goBack()
  await this.cart.openFromNavBar()
  expect(await this.cart.hasItems()).toBe(true)
})

When(/^the user increases the quantity of the item$/, async function () {
  this.totalBefore = await this.cart.getOrderTotal()
  await this.cart.increaseItemQuantity()
})

Then(/^the order total should increase$/, async function () {
  await browser.waitUntil(
    async () => (await this.cart.getOrderTotal()) !== this.totalBefore,
    { timeout: 5_000, timeoutMsg: 'Order total did not change after increasing quantity' },
  )
  const before = parseFloat(this.totalBefore.replace('$', ''))
  const after = parseFloat((await this.cart.getOrderTotal()).replace('$', ''))
  expect(after).toBeGreaterThan(before)
})

When(/^the user decreases the quantity of the item$/, async function () {
  this.totalBefore = await this.cart.getOrderTotal()
  await this.cart.decreaseItemQuantity()
})

Then(/^the order total should decrease$/, async function () {
  await browser.waitUntil(
    async () => (await this.cart.getOrderTotal()) !== this.totalBefore,
    { timeout: 5_000, timeoutMsg: 'Order total did not change after decreasing quantity' },
  )
  const before = parseFloat(this.totalBefore.replace('$', ''))
  const after = parseFloat((await this.cart.getOrderTotal()).replace('$', ''))
  expect(after).toBeLessThan(before)
})

When(/^the user swipes left on the cart item$/, async function () {
  await this.cart.swipeFirstItemLeft()
})

Then(/^the item should be removed from the cart$/, async function () {
  expect(await this.cart.isEmptyMessageVisible()).toBe(true)
})

When(/^the user taps Undo$/, async function () {
  await this.cart.tapUndo()
})

When(/^the user taps Proceed to Checkout$/, async function () {
  this.checkout = await this.cart.tapCheckout()
})

Then(/^the user should be navigated to the checkout screen$/, async function () {
  expect(await this.checkout.isLoaded()).toBe(true)
})
