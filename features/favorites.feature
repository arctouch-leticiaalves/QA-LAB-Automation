Feature: My Favorites

  As a logged-in user
  I want to view and manage products saved to My Favorites
  So that I can quickly revisit items I like

  Background:
    Given the user is on the profile screen

  @smoke @critical @favorites @android
  Scenario: Opening My Favorites with no saved products shows the empty state
    When the user opens My Favorites
    Then the my favorites screen should be displayed
      And the no favorites yet message should be displayed

  @regression @high @favorites @android
  Scenario: A favorited product appears on the My Favorites screen
    Given the user favorites the first shop product
    When the user opens My Favorites
    Then the favorited product should be visible on My Favorites

  @regression @high @favorites @android
  Scenario: Tapping a favorite opens the product detail screen
    Given the user favorites the first shop product
    When the user opens My Favorites
      And the user opens the favorited product from My Favorites
    Then the user should be navigated to the product detail screen

  @regression @high @favorites @android
  Scenario: Removing a favorite returns the empty state
    Given the user favorites the first shop product
    When the user opens My Favorites
      And the user removes the favorited product from My Favorites
    Then the no favorites yet message should be displayed
