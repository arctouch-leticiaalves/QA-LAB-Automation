Feature: My Orders

  As a logged-in user
  I want to browse my order history and open order details
  So that I can track past purchases

  Background:
    Given the user is on the profile screen

  @smoke @critical @orders @android
  Scenario: Opening My Orders shows the order list with All selected
    When the user opens My Orders
    Then the my orders screen should be displayed
      And the All orders filter should be selected
      And order ORD-2026-001 should be visible
      And order ORD-2026-002 should be visible
      And order ORD-2026-003 should be visible

  @regression @high @orders @android
  Scenario: Filtering by Cancelled shows the empty state
    When the user opens My Orders
      And the user filters orders by Cancelled
    Then the no orders found message should be displayed

  @regression @high @orders @android
  Scenario: Filtering by Delivered shows only delivered orders
    When the user opens My Orders
      And the user filters orders by Delivered
    Then order ORD-2026-001 should be visible
      And order ORD-2026-002 should not be visible
      And order ORD-2026-003 should not be visible

  @regression @critical @orders @android
  Scenario: Opening an order shows the order detail screen
    When the user opens My Orders
      And the user opens order ORD-2026-001
    Then the order detail screen for ORD-2026-001 should be displayed
      And the order detail status should be Delivered
      And the order items section should be displayed
      And the order summary section should be displayed

  @regression @critical @orders @checkout @android
  Scenario: A newly placed order appears in My Orders history
    Given the user places a successful order from checkout
    When the user continues shopping from the order confirmation
      And the user opens My Orders from the profile
    Then the confirmed order should be visible with status Processing
    When the user opens the confirmed order
    Then the order detail for the confirmed order should be displayed
      And the order detail status should be Processing
      And the order items section should be displayed
      And the order summary section should be displayed
