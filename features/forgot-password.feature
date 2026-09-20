Feature: Forgot password

  As a registered user
  I want to request a password reset link by email
  So that I can regain access to my account

  Background:
    Given the user is on the forgot password screen

  @smoke @critical @forgot-password @android
  Scenario: Requesting a reset link with a valid email shows confirmation
    When the user submits the forgot password form with testing@arctouch.com
    Then the reset link confirmation should be displayed
      And the confirmation should mention testing@arctouch.com

  @regression @medium @forgot-password @android
  Scenario Outline: Submitting the forgot password form with <case> keeps the form with an error
    When the user submits the forgot password form with <email>
    Then the forgot password screen should still be displayed
      And a forgot password error indicator should be visible

    Examples:
      | case             | email       |
      | empty email      |             |
      | malformed email  | notanemail  |

  @regression @medium @forgot-password @android
  Scenario: Tapping Back to Sign In from the confirmation returns to login
    When the user submits the forgot password form with testing@arctouch.com
      And the user taps Back to Sign In
    Then the user should be navigated to the login screen
