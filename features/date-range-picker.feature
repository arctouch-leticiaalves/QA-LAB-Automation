Feature: Date Range Picker

  As a logged-in user
  I want to select a date range in the QA sandbox
  So that date range picker interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @date-range @android
  Scenario: Opening Date Range Picker shows the pick range action
    When the user opens Additional Tests
      And the user opens the Date & Time Pickers scenario
    Then the date range picker should be displayed

  @regression @high @additional-tests @date-range @android
  Scenario: Selecting a date range updates the displayed range
    When the user opens Additional Tests
      And the user opens the Date & Time Pickers scenario
      And the user selects a date range from day 10 to day 20 of the next month
    Then the selected date range should be displayed
