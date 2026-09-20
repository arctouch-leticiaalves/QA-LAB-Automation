export const SETTINGS_LOCATORS = {
  backButton: '~Back',

  settingsTitle:
    'android=new UiSelector().description("Settings").clickable(false)',

  settingsTab: 'android=new UiSelector().descriptionContains("Tab 4 of 4")',

  additionalTestsButton:
    'android=new UiSelector().descriptionContains("Additional tests button")',

  resetAppButton:
    'android=new UiSelector().descriptionContains("Reset app to factory defaults")',

  resetAppDialogTitle:
    'android=new UiSelector().description("Reset App").clickable(false)',

  resetAppDialogMessage:
    'android=new UiSelector().descriptionContains("This will erase everything")',

  cancelResetButton:
    'android=new UiSelector().descriptionContains("Cancel reset")',

  confirmResetButton:
    'android=new UiSelector().descriptionContains("Confirm reset app")',

  resetSuccessToast:
    'android=new UiSelector().descriptionContains("App has been reset to factory defaults")',

  logoutButton: 'android=new UiSelector().descriptionContains("Logout button")',

  logoutDialogTitle:
    'android=new UiSelector().descriptionContains("Are you sure you want to logout")',

  cancelLogoutButton:
    'android=new UiSelector().descriptionContains("Cancel logout")',

  confirmLogoutButton:
    'android=new UiSelector().descriptionContains("Confirm logout")',

  deleteAccountButton:
    'android=new UiSelector().descriptionContains("Delete account button")',
} as const
