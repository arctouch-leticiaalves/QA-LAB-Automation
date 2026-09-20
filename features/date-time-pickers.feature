Feature: Date & Time Pickers

  As a logged-in user
  I want to select a date in the QA sandbox
  So that date picker interactions can be validated

  Background:
    Given the user is on the settings screen

  @regression @high @additional-tests @date-picker @android
  Scenario: Selecting a future date updates the displayed date
    When the user opens Additional Tests
      And the user opens the Date & Time Pickers scenario
      And the user selects day 15 of the next month
    Then the selected date should be displayed
