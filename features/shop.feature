# Shop browsing and product discovery on the QA-Lab Android app.
# Pattern: AAA (Arrange · Act · Assert) mapped onto Given · When · Then.
# Requires authentication — the Background performs a smart login using noReset:true.
# Default credentials: testing@arctouch.com / QA1234.
# AUTOMATION_TBD: yes — core product discovery journey; high business value.

Feature: Shop product browsing

  As a logged-in user
  I want to browse and search products in the shop
  So that I can find items I want to purchase

  Background:
    Given the user is on the shop screen

  @smoke @critical @shop @android
  Scenario: Shop screen loads and displays products with a counter
    Then the shop should display a list of products
    And the counter should show the number of visible products

  @regression @high @shop @android
  Scenario: Filtering by a category narrows the product list
    When the user filters by the Electronics category
    Then the counter should show 8 of 8 products
    And the Electronics category chip should be selected

  @regression @high @shop @android
  Scenario: Resetting the category filter to All restores the full product list
    When the user filters by the Electronics category
    And the user resets the filter to All
    Then the counter should show all 30 products

  @regression @high @shop @android
  Scenario: Searching for a product term filters the list
    When the user searches for Laptop
    Then the counter should reflect the filtered product count

  @regression @medium @shop @android
  Scenario: Searching for a non-existent term shows no products
    When the user searches for xyznonexistentproduct
    Then no products should be displayed in the shop

  @regression @high @shop @android
  Scenario: Tapping a product card navigates to the product detail screen
    When the user taps the first product in the list
    Then the user should be navigated to the product detail screen
