Feature: Time Picker

  As a logged-in user
  I want to select a time in the QA sandbox
  So that time picker interactions can be validated

  Background:
    Given the user is on the settings screen

  @regression @high @additional-tests @time-picker @android
  Scenario: Selecting a time updates the displayed time
    When the user opens Additional Tests
      And the user opens the Date & Time Pickers scenario
      And the user selects the time 10:30 AM
    Then the selected time should be displayed
