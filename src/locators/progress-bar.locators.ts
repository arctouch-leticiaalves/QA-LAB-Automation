export const PROGRESS_BAR_LOCATORS = {
  progressBarTitle:
    'android=new UiSelector().description("Progress Bar").clickable(false)',

  downloadProgress: (percent: number) =>
    `android=new UiSelector().descriptionContains("Download progress ${percent} percent")`,

  progressLabel: (percent: number) =>
    `android=new UiSelector().descriptionContains("Progress: ${percent} percent")`,

  readyStatus:
    'android=new UiSelector().descriptionContains("Ready to download")',

  downloadingStatus:
    'android=new UiSelector().descriptionContains("Downloading")',

  downloadComplete:
    'android=new UiSelector().descriptionContains("Download Complete")',

  startDownloadButton: '~Start Download',
  downloadAgainButton: '~Download Again',
  resetButton: '~Reset',
} as const
