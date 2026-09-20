Feature: Accordion

  As a logged-in user
  I want to expand and collapse accordion sections in the QA sandbox
  So that expandable content interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @accordion @android
  Scenario: Opening Accordion displays all sections collapsed
    When the user opens Additional Tests
      And the user opens the Accordion scenario
    Then the accordion screen should be displayed
      And 0 of 5 sections should be expanded
      And the Expand All button should be displayed

  @regression @high @additional-tests @accordion @android
  Scenario: Expanding a section reveals its content
    When the user opens Additional Tests
      And the user opens the Accordion scenario
      And the user expands the What is this app section
    Then the What is this app section should be expanded
      And the What is this app section content should be displayed
      And 1 of 5 sections should be expanded

  @regression @high @additional-tests @accordion @android
  Scenario: Collapsing an expanded section hides its content
    When the user opens Additional Tests
      And the user opens the Accordion scenario
      And the user expands the What is this app section
      And the user collapses the What is this app section
    Then the What is this app section should be collapsed
      And 0 of 5 sections should be expanded

  @regression @high @additional-tests @accordion @android
  Scenario: Expand All and Collapse All toggle every section
    When the user opens Additional Tests
      And the user opens the Accordion scenario
      And the user taps Expand All
    Then 5 of 5 sections should be expanded
      And the Collapse All button should be displayed
    When the user taps Collapse All
    Then 0 of 5 sections should be expanded
      And the Expand All button should be displayed
