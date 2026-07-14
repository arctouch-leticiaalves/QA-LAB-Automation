Feature: Shopping cart management

  As a logged-in user
  I want to manage items in my shopping cart
  So that I can review and proceed with my purchase

  Background:
    Given the user is on the cart screen

  @smoke @critical @cart @android
  Scenario: Cart screen shows empty state message when no items are added
    Then the user should see an empty cart message

  @regression @high @cart @android
  Scenario: Adding a product to the cart from the shop shows it in the cart
    Given the user adds the first product to the cart from the shop
    When the user navigates to the cart
    Then the product should be displayed in the cart

  @regression @high @cart @android
  Scenario: Increasing the quantity of a cart item updates the total price
    Given the user has a product in the cart
    When the user increases the quantity of the item
    Then the order total should increase

  @regression @high @cart @android
  Scenario: Decreasing the quantity of a cart item updates the total price
    Given the user has a product in the cart
    When the user increases the quantity of the item
    And the user decreases the quantity of the item
    Then the order total should decrease

  @regression @high @cart @android
  Scenario: Swiping left on a cart item removes it from the cart
    Given the user has a product in the cart
    When the user swipes left on the cart item
    Then the item should be removed from the cart

  @regression @high @cart @android
  Scenario: Removing a cart item and tapping Undo restores the item
    Given the user has a product in the cart
    When the user swipes left on the cart item
    And the user taps Undo
    Then the product should be displayed in the cart

  @regression @critical @cart @android
  Scenario: Tapping Proceed to Checkout navigates to the checkout screen
    Given the user has a product in the cart
    When the user taps Proceed to Checkout
    Then the user should be navigated to the checkout screen
