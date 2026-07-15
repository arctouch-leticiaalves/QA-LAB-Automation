Feature: Edit profile

  As a logged-in user
  I want to update my profile information
  So that my account details stay accurate

  Background:
    Given the user is on the edit profile screen

  @smoke @critical @profile @android
  Scenario: Saving valid profile details persists the updated information
    When the user updates the profile with valid details
    Then a profile success message must be displayed

  @regression @high @profile @android
  Scenario: Saving the profile with only required fields still succeeds
    When the user updates the profile with valid required fields only
    Then a profile success message must be displayed

  @regression @medium @profile @android
  Scenario Outline: Submitting the edit profile form with <case> keeps the user on the screen with an error
    When the user submits the edit profile form with <case>
    Then the edit profile screen should still be displayed
      And a <error_type> error indicator should be visible

    Examples:
       | case              | error_type |
      |  an empty full name | required   |
      |  an empty email     | required   |
      |  a malformed email  | field      |

  @regression @high @profile @android
  Scenario: Tapping Back with unsaved changes shows a discard confirmation dialog
    When the user makes an unsaved change to the profile
    And the user taps Back
    Then a discard changes confirmation dialog should be displayed
