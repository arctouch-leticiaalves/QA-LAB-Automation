import { When, Then } from '@wdio/cucumber-framework'

Then(
  /^the product detail should show the product name and price$/,
  async function () {
    expect(await this.productDetail.hasProductNameAndPrice()).toBe(true)
  },
)

Then(
  /^the product image carousel should be on page (\d+) of (\d+)$/,
  async function (current: string, total: string) {
    const page = await this.productDetail.getCarouselPage()
    expect(page.current).toBe(Number(current))
    expect(page.total).toBe(Number(total))
  },
)

When(
  /^the user swipes the product image carousel to the next image$/,
  async function () {
    await this.productDetail.swipeCarouselToNextImage()
  },
)

When(
  /^the user favorites the product from the detail screen$/,
  async function () {
    await this.productDetail.favoriteProduct()
  },
)

When(
  /^the user unfavorites the product from the detail screen$/,
  async function () {
    await this.productDetail.unfavoriteProduct()
  },
)

Then(
  /^the product should be marked as favorited on the detail screen$/,
  async function () {
    expect(await this.productDetail.isFavorited()).toBe(true)
  },
)

Then(
  /^the product should not be marked as favorited on the detail screen$/,
  async function () {
    expect(await this.productDetail.isFavorited()).toBe(false)
  },
)

When(
  /^the user increases the product quantity on the detail screen$/,
  async function () {
    this.pdpUnitPrice = await this.productDetail.getUnitPrice()
    await this.productDetail.increaseQuantity()
  },
)

Then(
  /^the product quantity on the detail screen should be (\d+)$/,
  async function (quantity: string) {
    expect(await this.productDetail.getQuantity()).toBe(Number(quantity))
  },
)

Then(
  /^the product total on the detail screen should be greater than the unit price$/,
  async function () {
    const total = await this.productDetail.getTotal()
    expect(total).toBeGreaterThan(this.pdpUnitPrice)
  },
)

When(
  /^the user adds the product to the cart from the detail screen$/,
  async function () {
    await this.productDetail.tapAddToCart()
  },
)

Then(/^the added to cart confirmation should be displayed$/, async function () {
  expect(await this.productDetail.isAddedToCartConfirmationDisplayed()).toBe(
    true,
  )
})

When(
  /^the user opens the cart from the product detail confirmation$/,
  async function () {
    this.cart = await this.productDetail.openCartFromConfirmation()
  },
)
