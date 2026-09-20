Feature: Notifications

  As a logged-in user
  I want to trigger in-app snackbars and banners in the QA sandbox
  So that notification interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @notifications @android
  Scenario: Opening Notifications shows the trigger actions
    When the user opens Additional Tests
      And the user opens the Notifications scenario
    Then the notifications screen should be displayed
      And the event log should be empty

  @regression @high @additional-tests @notifications @android
  Scenario: Showing a persistent banner logs the event
    When the user opens Additional Tests
      And the user opens the Notifications scenario
      And the user shows the persistent banner
    Then the persistent banner event should be logged
