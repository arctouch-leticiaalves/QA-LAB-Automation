import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'
import { ShopScreen } from '../screens/shop.screen'
import { CartScreen } from '../screens/cart.screen'
import { checkoutData } from '../support/test-data/checkout'

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

When(/^the user completes the address step with valid details$/, async function () {
  this.checkoutData = checkoutData.valid()
  await this.checkout.completeAddressStep(this.checkoutData.address)
})

When(/^the user submits the address step with empty fields$/, async function () {
  await this.checkout.submitAddressStep(checkoutData.emptyAddress())
})

When(/^the user completes the payment step with valid details$/, async function () {
  await this.checkout.completePaymentStep(this.checkoutData.payment)
})

When(/^the user submits the payment step with empty fields$/, async function () {
  await this.checkout.submitPaymentStep(checkoutData.emptyPayment())
})

When(
  /^the user submits the payment step with an invalid short card number$/,
  async function () {
    await this.checkout.submitPaymentStep(checkoutData.invalidShortCard())
  },
)

When(/^the user completes the payment step with a declined card$/, async function () {
  await this.checkout.completePaymentStep(checkoutData.declinedCard())
})

When(/^the user reviews and places the order$/, async function () {
  await this.checkout.placeOrderAndWaitForConfirmation()
})

When(/^the user places the order$/, async function () {
  await this.checkout.placeOrder()
})

Then(/^the order confirmation should be displayed$/, async function () {
  expect(await this.checkout.isOrderConfirmationDisplayed()).toBe(true)
})

Then(/^the order confirmation should not be displayed$/, async function () {
  expect(await this.checkout.isOrderConfirmationDisplayed(2_000)).toBe(false)
})

Then(/^the checkout address step should still be displayed$/, async function () {
  expect(await this.checkout.isOnAddressStep()).toBe(true)
})

Then(/^the checkout payment step should still be displayed$/, async function () {
  expect(await this.checkout.isOnPaymentStep()).toBe(true)
})

Then(
  /^a checkout validation error containing (.+) should be visible$/,
  async function (text: string) {
    expect(await this.checkout.hasValidationError(text)).toBe(true)
  },
)

Then(/^the payment declined message should be displayed$/, async function () {
  expect(await this.checkout.isPaymentDeclinedDisplayed()).toBe(true)
})
