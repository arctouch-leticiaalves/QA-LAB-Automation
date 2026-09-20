Feature: Multi-Select

  As a logged-in user
  I want to select multiple items and apply bulk actions in the QA sandbox
  So that multi-selection interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @multi-select @android
  Scenario: Opening Multi-Select shows an empty selection
    When the user opens Additional Tests
      And the user opens the Multi-Select scenario
    Then the multi-select screen should be displayed
      And 0 items should be selected

  @regression @high @additional-tests @multi-select @android
  Scenario: Selecting two items updates the selected count
    When the user opens Additional Tests
      And the user opens the Multi-Select scenario
      And the user selects Annual Report.pdf
      And the user selects Budget_2026.xlsx
    Then Annual Report.pdf should be selected
      And Budget_2026.xlsx should be selected
      And 2 items should be selected

  @regression @high @additional-tests @multi-select @android
  Scenario: Select All selects every item
    When the user opens Additional Tests
      And the user opens the Multi-Select scenario
      And the user taps Select All
    Then the Deselect All button should be displayed
      And 12 items should be selected
