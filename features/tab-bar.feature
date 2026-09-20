Feature: Tab Bar

  As a logged-in user
  I want to switch between tab views in the QA sandbox
  So that tab navigation interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @tab-bar @android
  Scenario: Opening Tab Bar displays the first tab as active
    When the user opens Additional Tests
      And the user opens the Tab Bar scenario
    Then the tab bar screen should be displayed
      And the Home tab should be visible
      And the Explore tab should be visible
      And the active tab should be 1 of 4
      And the Home tab content should be displayed

  @regression @high @additional-tests @tab-bar @android
  Scenario: Selecting Explore updates the active tab and content
    When the user opens Additional Tests
      And the user opens the Tab Bar scenario
      And the user opens the Explore tab
    Then the active tab should be 2 of 4
      And the Explore tab content should be displayed
