Feature: Additional Tests sandbox

  As a logged-in user
  I want to access UI interaction scenarios in the QA sandbox
  So that I can practice and validate Appium automation patterns

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @android
  Scenario: Opening Additional Tests from Settings displays the sandbox scenarios
    When the user opens Additional Tests
    Then the additional tests screen should be displayed
      And the gesture test scenarios should be visible
      And the widget test scenarios should be visible

  @regression @high @additional-tests @drag-drop @android
  Scenario: Opening Drag & Drop displays the reorderable item list
    When the user opens Additional Tests
      And the user opens the Drag & Drop scenario
    Then the drag and drop screen should be displayed
      And the list should show 8 draggable items
      And the order display should show the default item sequence

  @regression @high @additional-tests @drag-drop @android
  Scenario: Dragging an item to a new position updates the displayed order
    When the user opens Additional Tests
      And the user opens the Drag & Drop scenario
      And the user drags Item 1 below Item 3
    Then the order display should show Item 2 before Item 1
