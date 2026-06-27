# Login behavior on the QA-Lab Android app.
# Pattern: AAA (Arrange · Act · Assert) mapped onto Given · When · Then.
# Default credentials shown by the app banner: testing@arctouch.com / QA1234.
# AUTOMATION_TBD: yes — login is the entry point of every user journey.

Feature: User login

  As a registered user
  I want to sign in with my email and password
  So that I can access the app

  Background:
    Given the user is on the login screen

  @smoke @critical @login @android
  Scenario: Logging in with valid credentials navigates the user to the shop screen
    # Act
    When the user submits the login form with testing@arctouch.com and QA1234
    # Assert
    Then the user should be navigated to the shop screen

  @regression @medium @login @android
  Scenario Outline: Logging in with <case> credentials keeps the user on the login screen with an error
    # Act
    When the user submits the login form with <email> and <password>
    # Assert
    Then the login screen should still be displayed
      And a login error indicator should be visible

    Examples:
       | case                 | email                  | password    |
      |  malformed email     |  notanemail            |  QA1234     |
      |  wrong password      |  testing@arctouch.com  |  WrongPass1 |
      |  unregistered email  |  ghost@example.com     |  QA1234     |

  @regression @medium @login @android
  Scenario: Submitting the login form with empty fields keeps the user on the login screen
    # Act
    When the user submits the login form without typing anything
    # Assert
    Then the login screen should still be displayed
      And a login error indicator should be visible
