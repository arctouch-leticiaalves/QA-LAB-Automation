Feature: Logout

  As a logged-in user
  I want to log out from Settings
  So that my session ends and I return to the login screen

  Background:
    Given the user is on the settings screen

  @smoke @critical @logout @android
  Scenario: Confirming logout returns the user to the login screen
    When the user taps Logout
      And the user confirms logout
    Then the user should be navigated to the login screen

  @regression @high @logout @android
  Scenario: Tapping Logout shows a confirmation dialog
    When the user taps Logout
    Then the logout confirmation dialog should be displayed

  @regression @medium @logout @android
  Scenario: Cancelling logout keeps the user on the settings screen
    When the user taps Logout
      And the user cancels logout
    Then the settings screen should still be displayed
      And the logout confirmation dialog should not be displayed
