export const NOTIFICATIONS_LOCATORS = {
  notificationsTitle:
    'android=new UiSelector().description("Notifications").clickable(false)',

  showBannerButton: '~Show Banner',
  snackbar2sButton: '~2s',
  snackbar4sButton: '~4s + Action',
  snackbar8sButton: '~8s',
  styledSnackbarButton: '~Styled',

  eventLogEmpty:
    'android=new UiSelector().descriptionContains("Trigger a notification to see events here")',

  showedPersistentBanner:
    'android=new UiSelector().descriptionContains("Showed persistent banner")',

  bannerVisible:
    'android=new UiSelector().descriptionContains("Banner Visible")',

  persistentBannerMessage:
    'android=new UiSelector().descriptionContains("This is a persistent banner notification")',

  dismissBannerButton: '~DISMISS',
  learnMoreButton: '~LEARN MORE',
} as const
