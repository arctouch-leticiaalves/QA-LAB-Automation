import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Timer and Stopwatch scenario$/, async function () {
  this.timerStopwatch = await this.additionalTests.openTimerStopwatch()
})

When(/^the user starts the stopwatch$/, async function () {
  await this.timerStopwatch.start()
})

When(/^the user pauses the stopwatch$/, async function () {
  await this.timerStopwatch.pause()
})

When(/^the user resets the stopwatch$/, async function () {
  await this.timerStopwatch.reset()
})

Then(/^the timer and stopwatch screen should be displayed$/, async function () {
  expect(await this.timerStopwatch.isLoaded()).toBe(true)
})

Then(/^the stopwatch should be ready$/, async function () {
  expect(await this.timerStopwatch.isReady()).toBe(true)
})

Then(/^the stopwatch should be running$/, async function () {
  expect(await this.timerStopwatch.isRunning()).toBe(true)
})

Then(/^the stopwatch should be paused$/, async function () {
  expect(await this.timerStopwatch.isPaused()).toBe(true)
})

Then(/^the elapsed time should be 00:00\.00$/, async function () {
  expect(await this.timerStopwatch.getElapsedDisplay()).toBe('00:00.00')
})
