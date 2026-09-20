Feature: Product Detail

  As a logged-in user
  I want to review a product and add it to my cart from the detail screen
  So that I can complete the core product purchase journey

  Background:
    Given the user is on the shop screen

  @smoke @critical @product-detail @android
  Scenario: Opening a product shows the product detail screen
    When the user taps the first product in the list
    Then the user should be navigated to the product detail screen
      And the product detail should show the product name and price
      And the product image carousel should be on page 1 of 3

  @regression @high @product-detail @android
  Scenario: Swiping the product image carousel advances to the next image
    When the user taps the first product in the list
      And the user swipes the product image carousel to the next image
    Then the product image carousel should be on page 2 of 3

  @regression @high @product-detail @android
  Scenario: Favoriting a product from the detail screen
    When the user taps the first product in the list
      And the user favorites the product from the detail screen
    Then the product should be marked as favorited on the detail screen

  @regression @high @product-detail @android
  Scenario: Unfavoriting a product from the detail screen
    When the user taps the first product in the list
      And the user favorites the product from the detail screen
      And the user unfavorites the product from the detail screen
    Then the product should not be marked as favorited on the detail screen

  @regression @high @product-detail @android
  Scenario: Increasing quantity updates the total price
    When the user taps the first product in the list
      And the user increases the product quantity on the detail screen
    Then the product quantity on the detail screen should be 2
      And the product total on the detail screen should be greater than the unit price

  @regression @critical @product-detail @android
  Scenario: Adding a product to the cart from the detail screen
    When the user taps the first product in the list
      And the user increases the product quantity on the detail screen
      And the user adds the product to the cart from the detail screen
    Then the added to cart confirmation should be displayed
    When the user opens the cart from the product detail confirmation
    Then the product should be displayed in the cart
