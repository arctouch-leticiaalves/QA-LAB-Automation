Feature: User sign up

  As a new user
  I want to create an account with my details
  So that I can access the app under my own credentials

  Background:
    Given the user is on the sign up screen

  @smoke @critical @signup @android
  Scenario: Creating an account with valid details navigates the user away from the sign up screen
    # Act
    When the user creates an account with valid details
    # Assert
    Then a success toast message must be displayed
    And the user should be navigated to the login screen

  @regression @high @signup @android
  Scenario: Creating an account with valid details but no phone still succeeds
    # Act
    When the user creates an account with valid details and no phone
    # Assert
    Then a success toast message must be displayed
    And the user should be navigated to the login screen

  @regression @medium @signup @android
  Scenario Outline: Submitting the sign up form with <case> keeps the user on the screen with an error
    # Act
    When the user submits the sign up form with <case>
    # Assert
    Then the sign up screen should still be displayed
      And a sign up error indicator should be visible

    Examples:
       | case                                |
      |  all fields empty                   |
      |  a malformed email                  |
      |  mismatched passwords               |
      |  an already registered email        |
      |  valid details but terms unchecked  |

  @regression @low @signup @android
  Scenario: Tapping the Sign In link returns the user to the login screen
    # Act
    When the user taps the Sign In link
    # Assert
    Then the user should be navigated to the login screen
