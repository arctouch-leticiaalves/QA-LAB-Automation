Feature: Swipeable Carousel

  As a logged-in user
  I want to swipe through carousel pages in the QA sandbox
  So that horizontal navigation and page indicators can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @swipeable-carousel @android
  Scenario: Opening Swipeable Carousel displays the first page with active indicator
    When the user opens Additional Tests
      And the user opens the Swipeable Carousel scenario
    Then the swipeable carousel screen should be displayed
      And page 1 of 4 should be displayed
      And the Welcome carousel page should be visible
      And page indicator 1 should be active

  @regression @high @additional-tests @swipeable-carousel @android
  Scenario: Swiping left navigates to the next carousel page
    When the user opens Additional Tests
      And the user opens the Swipeable Carousel scenario
      And the user swipes left on the carousel
    Then page 2 of 4 should be displayed
      And the Features carousel page should be visible
      And page indicator 2 should be active

  @regression @high @additional-tests @swipeable-carousel @android
  Scenario: Swiping right navigates to the previous carousel page
    When the user opens Additional Tests
      And the user opens the Swipeable Carousel scenario
      And the user swipes left on the carousel
      And the user swipes right on the carousel
    Then page 1 of 4 should be displayed
      And the Welcome carousel page should be visible
      And page indicator 1 should be active
