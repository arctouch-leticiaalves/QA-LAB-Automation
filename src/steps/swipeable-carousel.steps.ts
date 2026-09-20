import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Swipeable Carousel scenario$/, async function () {
  this.swipeableCarousel = await this.additionalTests.openSwipeableCarousel()
})

When(/^the user swipes left on the carousel$/, async function () {
  await this.swipeableCarousel.swipeLeft()
})

When(/^the user swipes right on the carousel$/, async function () {
  await this.swipeableCarousel.swipeRight()
})

When(/^the user swipes left on the carousel (\d+) times$/, async function (
  times: string,
) {
  await this.swipeableCarousel.swipeLeftTimes(Number(times))
})

Then(/^the swipeable carousel screen should be displayed$/, async function () {
  expect(await this.swipeableCarousel.isLoaded()).toBe(true)
})

Then(/^page (\d+) of 4 should be displayed$/, async function (page: string) {
  expect(await this.swipeableCarousel.isPageDisplayed(Number(page))).toBe(true)
})

Then(
  /^the (Welcome|Features|Performance|Finish) carousel page should be visible$/,
  async function (pageTitle: string) {
    expect(await this.swipeableCarousel.isCarouselPageVisible(pageTitle)).toBe(
      true,
    )
  },
)

Then(/^page indicator (\d+) should be active$/, async function (page: string) {
  expect(await this.swipeableCarousel.isActiveIndicator(Number(page))).toBe(
    true,
  )
})
