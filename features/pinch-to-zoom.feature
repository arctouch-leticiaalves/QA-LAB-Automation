Feature: Pinch to Zoom

  As a logged-in user
  I want to pinch-zoom and reset the zoomable grid in the QA sandbox
  So that multi-touch zoom interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @pinch-to-zoom @android
  Scenario: Opening Pinch to Zoom shows the default zoom level
    When the user opens Additional Tests
      And the user opens the Pinch to Zoom scenario
    Then the pinch to zoom screen should be displayed
      And the zoom level should be 1.0x

  @regression @high @additional-tests @pinch-to-zoom @android
  Scenario: Pinching open zooms in and reset restores default zoom
    When the user opens Additional Tests
      And the user opens the Pinch to Zoom scenario
      And the user pinches open on the zoom surface
    Then the zoom level should be greater than 1.0x
    When the user resets the zoom
    Then the zoom level should be 1.0x

  @regression @high @additional-tests @pinch-to-zoom @android
  Scenario: Pinching closed after zoom restores a lower zoom level
    When the user opens Additional Tests
      And the user opens the Pinch to Zoom scenario
      And the user pinches open on the zoom surface
      And the user pinches closed on the zoom surface
    Then the zoom level should be 1.0x
