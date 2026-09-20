Feature: Reset App

  As a logged-in user
  I want to reset the app to factory defaults from Settings
  So that all local data is cleared and I return to a fresh login state

  Background:
    Given the user is on the settings screen

  @smoke @critical @reset-app @android
  Scenario: Confirming reset app returns the user to the login screen
    When the user taps Reset App
      And the user confirms reset app
    Then the user should be navigated to the login screen
      And the reset app success toast should be displayed

  @regression @high @reset-app @android
  Scenario: Tapping Reset App shows a confirmation dialog
    When the user taps Reset App
    Then the reset app confirmation dialog should be displayed

  @regression @medium @reset-app @android
  Scenario: Cancelling reset app keeps the user on the settings screen
    When the user taps Reset App
      And the user cancels reset app
    Then the settings screen should still be displayed
      And the reset app confirmation dialog should not be displayed
