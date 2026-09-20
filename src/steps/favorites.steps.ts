import { Given, When, Then } from '@wdio/cucumber-framework'
import { ShopScreen } from '../screens/shop.screen'
import { ProfileScreen } from '../screens/profile.screen'

Given(/^the user favorites the first shop product$/, async function () {
  this.shop = new ShopScreen()
  await this.shop.openFromNavBar()
  await this.shop.ensureProductIsNotFavorited()
  this.favoritedProductName = await this.shop.getFirstProductName()
  await this.shop.tapFavIcon()
  expect(await this.shop.isFavIconSelected()).toBe(true)

  this.profile = new ProfileScreen()
  await this.profile.openFromNavBar()
})

When(/^the user opens My Favorites$/, async function () {
  this.favorites = await this.profile.openMyFavorites()
})

When(/^the user opens the favorited product from My Favorites$/, async function () {
  this.productDetail = await this.favorites.openProduct(
    this.favoritedProductName,
  )
})

When(/^the user removes the favorited product from My Favorites$/, async function () {
  await this.favorites.removeProduct(this.favoritedProductName)
})

Then(/^the my favorites screen should be displayed$/, async function () {
  expect(await this.favorites.isLoaded()).toBe(true)
})

Then(/^the no favorites yet message should be displayed$/, async function () {
  expect(await this.favorites.isEmptyStateVisible()).toBe(true)
})

Then(/^the favorited product should be visible on My Favorites$/, async function () {
  expect(
    await this.favorites.isProductVisible(this.favoritedProductName),
  ).toBe(true)
})
