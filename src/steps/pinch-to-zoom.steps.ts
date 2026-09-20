import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Pinch to Zoom scenario$/, async function () {
  this.pinchToZoom = await this.additionalTests.openPinchToZoom()
})

When(/^the user pinches open on the zoom surface$/, async function () {
  await this.pinchToZoom.pinchOpen()
})

When(/^the user pinches closed on the zoom surface$/, async function () {
  await this.pinchToZoom.pinchClose()
})

When(/^the user resets the zoom$/, async function () {
  await this.pinchToZoom.resetZoom()
})

Then(/^the pinch to zoom screen should be displayed$/, async function () {
  expect(await this.pinchToZoom.isLoaded()).toBe(true)
})

Then(/^the zoom level should be 1\.0x$/, async function () {
  expect(await this.pinchToZoom.getZoomLevel()).toBe(1)
})

Then(/^the zoom level should be greater than 1\.0x$/, async function () {
  expect(await this.pinchToZoom.getZoomLevel()).toBeGreaterThan(1)
})
