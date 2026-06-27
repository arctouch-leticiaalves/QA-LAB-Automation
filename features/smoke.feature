# Smoke wiring test for the QA-Lab Android automation harness.
# Validates Appium session, app package/activity, and rendered UI without
# depending on copy or visuals that may change.
# Pattern: AAA (Arrange · Act · Assert) mapped onto Given · When · Then.
# AUTOMATION_TBD: yes — wiring proof, prerequisite for all other suites.

Feature: Automation harness smoke

  As a QA engineer
  I want a smoke that proves the Appium + WDIO + UiAutomator2 wiring
  So that I trust every other test in this suite

  @smoke @android @critical @harness
  Scenario: Launching the QA-Lab app brings the main activity to the foreground
    # Arrange
    Given the device has the QA-Lab app installed
    # Act
    When the QA-Lab app is launched
    # Assert
    Then the main activity should be in the foreground
      And the app UI tree should be rendered
