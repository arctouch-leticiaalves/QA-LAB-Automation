export const ORDERS_LOCATORS = {
  myOrdersTitle:
    'android=new UiSelector().description("My Orders").clickable(false)',

  filterChip: (status: string) =>
    `android=new UiSelector().descriptionContains("Filter: ${status}")`,

  noOrdersFound:
    'android=new UiSelector().descriptionContains("No orders found")',

  orderCard: (orderId: string) =>
    `android=new UiSelector().descriptionContains("Order ${orderId}")`,

  orderCardWithStatus: (orderId: string, status: string) =>
    `android=new UiSelector().descriptionContains("Order ${orderId}, ${status}")`,

  orderSummary: (orderId: string) =>
    `android=new UiSelector().descriptionContains("${orderId}")`,

  dismissHintButton:
    'android=new UiSelector().descriptionContains("Dismiss hint")',
} as const

export const ORDER_DETAIL_LOCATORS = {
  orderDetailTitle: (orderId: string) =>
    `android=new UiSelector().description("Order ${orderId}").clickable(false)`,

  orderIdLabel: (orderId: string) =>
    `android=new UiSelector().descriptionContains("Order ID: ${orderId}")`,

  orderStatus: (status: string) =>
    `android=new UiSelector().descriptionContains("Order status: ${status}")`,

  itemsSection:
    'android=new UiSelector().descriptionContains("Items (")',

  shippingAddressSection:
    'android=new UiSelector().descriptionContains("Shipping Address section")',

  paymentMethodSection:
    'android=new UiSelector().descriptionContains("Payment Method section")',

  orderSummarySection:
    'android=new UiSelector().descriptionContains("Order Summary section")',

  backButton: '~Back',
} as const
