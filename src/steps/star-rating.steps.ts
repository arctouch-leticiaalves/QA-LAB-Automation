import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Star Rating scenario$/, async function () {
  this.starRating = await this.additionalTests.openStarRating()
})

When(/^the user rates (\d+) stars$/, async function (value: string) {
  await this.starRating.rate(Number(value))
})

When(/^the user submits the rating$/, async function () {
  await this.starRating.submitRating()
})

Then(/^the star rating screen should be displayed$/, async function () {
  expect(await this.starRating.isLoaded()).toBe(true)
})

Then(/^the current rating should be (\d+)$/, async function (value: string) {
  expect(await this.starRating.getCurrentRating()).toBe(Number(value))
})

Then(
  /^the rating submitted confirmation for (\d+) stars should be displayed$/,
  async function (value: string) {
    expect(await this.starRating.isRatingSubmitted(Number(value))).toBe(true)
  },
)
