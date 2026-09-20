Feature: Dropdown Menus

  As a logged-in user
  I want to use dropdown, popup, and autocomplete controls in the QA sandbox
  So that selection interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @dropdown @android
  Scenario: Opening Dropdown Menus displays all selection patterns
    When the user opens Additional Tests
      And the user opens the Dropdown Menus scenario
    Then the dropdown menus screen should be displayed
      And the country dropdown should show no selection
      And the sort popup should show no selection
      And the country autocomplete should show no selection

  @regression @high @additional-tests @dropdown @android
  Scenario: Selecting a country from the standard dropdown updates the selection
    When the user opens Additional Tests
      And the user opens the Dropdown Menus scenario
      And the user selects Brazil from the country dropdown
    Then the country dropdown should show Brazil selected

  @regression @high @additional-tests @dropdown @android
  Scenario: Selecting a sort option from the popup menu updates the selection
    When the user opens Additional Tests
      And the user opens the Dropdown Menus scenario
      And the user selects Name A-Z from the sort popup
    Then the sort popup should show Name A-Z selected

  @regression @high @additional-tests @dropdown @android
  Scenario: Choosing a country from autocomplete updates the selection
    When the user opens Additional Tests
      And the user opens the Dropdown Menus scenario
      And the user types Bra in the country autocomplete and chooses Brazil
    Then the country autocomplete should show Brazil selected
