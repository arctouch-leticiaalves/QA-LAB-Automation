import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'
import { ShopScreen } from '../screens/shop.screen'
import { ProfileScreen } from '../screens/profile.screen'
import { checkoutData } from '../support/test-data/checkout'

const app = new AppActions()

Given(/^the user is on the profile screen$/, async function () {
  await app.clearData()
  await app.launch()

  this.login = new LoginScreen()
  await this.login.waitUntilLoaded()
  await this.login.submitForm('testing@arctouch.com', 'QA1234')

  this.shop = new ShopScreen()
  await this.shop.waitUntilLoaded()

  this.profile = new ProfileScreen()
  await this.profile.openFromNavBar()
})

Given(/^the user places a successful order from checkout$/, async function () {
  this.shop = new ShopScreen()
  await this.shop.openFromNavBar()

  const detail = await this.shop.tapFirstProduct()
  await detail.tapAddToCart()
  this.cart = await detail.openCartFromConfirmation()

  this.checkout = await this.cart.tapCheckout()
  this.checkoutData = checkoutData.valid()
  await this.checkout.completeAddressStep(this.checkoutData.address)
  await this.checkout.completePaymentStep(this.checkoutData.payment)
  await this.checkout.placeOrderAndWaitForConfirmation()
  this.confirmedOrderId = await this.checkout.getConfirmedOrderId()
})

When(/^the user continues shopping from the order confirmation$/, async function () {
  await this.checkout.continueShopping()
  this.shop = new ShopScreen()
  await this.shop.waitUntilLoaded()
})

When(/^the user opens My Orders from the profile$/, async function () {
  this.profile = new ProfileScreen()
  await this.profile.openFromNavBar()
  this.orders = await this.profile.openMyOrders()
})

When(/^the user opens My Orders$/, async function () {
  this.orders = await this.profile.openMyOrders()
})

When(/^the user filters orders by (.+)$/, async function (status: string) {
  await this.orders.tapFilter(status)
})

When(/^the user opens order (.+)$/, async function (orderId: string) {
  this.orderDetail = await this.orders.openOrder(orderId)
})

When(/^the user opens the confirmed order$/, async function () {
  this.orderDetail = await this.orders.openOrder(this.confirmedOrderId)
})

Then(/^the my orders screen should be displayed$/, async function () {
  expect(await this.orders.isLoaded()).toBe(true)
})

Then(/^the All orders filter should be selected$/, async function () {
  expect(await this.orders.isFilterSelected('All')).toBe(true)
})

Then(/^order (.+) should be visible$/, async function (orderId: string) {
  expect(await this.orders.isOrderVisible(orderId)).toBe(true)
})

Then(/^order (.+) should not be visible$/, async function (orderId: string) {
  expect(await this.orders.isOrderVisible(orderId)).toBe(false)
})

Then(/^the no orders found message should be displayed$/, async function () {
  expect(await this.orders.isNoOrdersFoundVisible()).toBe(true)
})

Then(
  /^the confirmed order should be visible with status (.+)$/,
  async function (status: string) {
    expect(
      await this.orders.isOrderVisibleWithStatus(
        this.confirmedOrderId,
        status,
      ),
    ).toBe(true)
  },
)

Then(
  /^the order detail screen for (.+) should be displayed$/,
  async function (_orderId: string) {
    expect(await this.orderDetail.isLoaded()).toBe(true)
  },
)

Then(
  /^the order detail for the confirmed order should be displayed$/,
  async function () {
    expect(await this.orderDetail.isLoaded()).toBe(true)
  },
)

Then(
  /^the order detail status should be (.+)$/,
  async function (status: string) {
    expect(await this.orderDetail.hasStatus(status)).toBe(true)
  },
)

Then(/^the order items section should be displayed$/, async function () {
  expect(await this.orderDetail.isItemsSectionVisible()).toBe(true)
})

Then(/^the order summary section should be displayed$/, async function () {
  expect(await this.orderDetail.isOrderSummaryVisible()).toBe(true)
})
