Feature: Progress Bar

  As a logged-in user
  I want to run a determinate download progress in the QA sandbox
  So that async progress interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @progress-bar @android
  Scenario: Opening Progress Bar shows the ready state
    When the user opens Additional Tests
      And the user opens the Progress Bar scenario
    Then the progress bar screen should be displayed
      And the download should be ready
      And the progress should be 0 percent

  @regression @high @additional-tests @progress-bar @android
  Scenario: Starting download reaches 100 percent
    When the user opens Additional Tests
      And the user opens the Progress Bar scenario
      And the user starts the download
    Then the download should complete
      And the progress should be 100 percent
