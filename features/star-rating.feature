Feature: Star Rating

  As a logged-in user
  I want to rate with stars in the QA sandbox
  So that rating interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @star-rating @android
  Scenario: Opening Star Rating shows an empty rating
    When the user opens Additional Tests
      And the user opens the Star Rating scenario
    Then the star rating screen should be displayed
      And the current rating should be 0

  @regression @high @additional-tests @star-rating @android
  Scenario: Submitting a 4 star rating shows confirmation
    When the user opens Additional Tests
      And the user opens the Star Rating scenario
      And the user rates 4 stars
      And the user submits the rating
    Then the current rating should be 4
      And the rating submitted confirmation for 4 stars should be displayed
