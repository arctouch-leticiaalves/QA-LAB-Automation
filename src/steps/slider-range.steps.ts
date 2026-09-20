import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Slider & Range scenario$/, async function () {
  this.sliderRange = await this.additionalTests.openSliderRange()
})

When(/^the user sets the continuous slider to (\d+)$/, async function (value: string) {
  await this.sliderRange.setContinuousSliderTo(Number(value))
})

When(/^the user sets the discrete slider to (\d+)$/, async function (value: string) {
  await this.sliderRange.setDiscreteSliderTo(Number(value))
})

When(/^the user sets the range slider from (\d+) to (\d+)$/, async function (
  min: string,
  max: string,
) {
  await this.sliderRange.setRangeSlider(Number(min), Number(max))
})

Then(/^the slider and range screen should be displayed$/, async function () {
  expect(await this.sliderRange.isLoaded()).toBe(true)
})

Then(/^the continuous slider should show value (\d+)$/, async function (value: string) {
  expect(await this.sliderRange.getContinuousSliderValue()).toBe(Number(value))
})

Then(/^the discrete slider should show value (\d+)$/, async function (value: string) {
  expect(await this.sliderRange.getDiscreteSliderValue()).toBe(Number(value))
})

Then(/^the range slider should show values (\d+) to (\d+)$/, async function (
  min: string,
  max: string,
) {
  const values = await this.sliderRange.getRangeSliderValues()
  expect(values.min).toBe(Number(min))
  expect(values.max).toBe(Number(max))
})
