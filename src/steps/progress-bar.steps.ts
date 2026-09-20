import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the Progress Bar scenario$/, async function () {
  this.progressBar = await this.additionalTests.openProgressBar()
})

When(/^the user starts the download$/, async function () {
  await this.progressBar.startDownload()
})

Then(/^the progress bar screen should be displayed$/, async function () {
  expect(await this.progressBar.isLoaded()).toBe(true)
})

Then(/^the download should be ready$/, async function () {
  expect(await this.progressBar.isReady()).toBe(true)
})

Then(/^the progress should be (\d+) percent$/, async function (percent: string) {
  expect(await this.progressBar.getProgressPercent()).toBe(Number(percent))
})

Then(/^the download should complete$/, async function () {
  await this.progressBar.waitUntilComplete()
  expect(await this.progressBar.isDownloadComplete()).toBe(true)
})
