Feature: Timer and Stopwatch

  As a logged-in user
  I want to start, pause, and reset a stopwatch in the QA sandbox
  So that timer control interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @timer-stopwatch @android
  Scenario: Opening Timer and Stopwatch shows the ready state
    When the user opens Additional Tests
      And the user opens the Timer and Stopwatch scenario
    Then the timer and stopwatch screen should be displayed
      And the stopwatch should be ready
      And the elapsed time should be 00:00.00

  @regression @high @additional-tests @timer-stopwatch @android
  Scenario: Starting, pausing, and resetting the stopwatch
    When the user opens Additional Tests
      And the user opens the Timer and Stopwatch scenario
      And the user starts the stopwatch
    Then the stopwatch should be running
    When the user pauses the stopwatch
    Then the stopwatch should be paused
    When the user resets the stopwatch
    Then the stopwatch should be ready
      And the elapsed time should be 00:00.00
