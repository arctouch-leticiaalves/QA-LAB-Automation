Feature: Checkout

  As a logged-in user
  I want to complete the checkout flow
  So that I can place an order successfully or see clear validation errors

  Background:
    Given the user is on the cart screen
    And the user has a product in the cart

  @regression @critical @checkout @android
  Scenario: Completing checkout places the order successfully
    When the user taps Proceed to Checkout
      And the user completes the address step with valid details
      And the user completes the payment step with valid details
      And the user reviews and places the order
    Then the order confirmation should be displayed

  @regression @high @checkout @android
  Scenario: Submitting the address step with empty fields shows validation errors
    When the user taps Proceed to Checkout
      And the user submits the address step with empty fields
    Then the checkout address step should still be displayed
      And a checkout validation error containing Name is required should be visible

  @regression @high @checkout @android
  Scenario: Submitting the payment step with empty fields shows validation errors
    When the user taps Proceed to Checkout
      And the user completes the address step with valid details
      And the user submits the payment step with empty fields
    Then the checkout payment step should still be displayed
      And a checkout validation error containing Card number is required should be visible

  @regression @high @checkout @android
  Scenario: Submitting an invalid card number keeps the user on the payment step
    When the user taps Proceed to Checkout
      And the user completes the address step with valid details
      And the user submits the payment step with an invalid short card number
    Then the checkout payment step should still be displayed
      And a checkout validation error containing Enter a valid card number should be visible

  @regression @critical @checkout @android
  Scenario: Placing an order with a declined card shows a payment error
    When the user taps Proceed to Checkout
      And the user completes the address step with valid details
      And the user completes the payment step with a declined card
      And the user places the order
    Then the payment declined message should be displayed
      And the order confirmation should not be displayed
