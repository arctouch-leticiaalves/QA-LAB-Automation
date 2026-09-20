Feature: Slider & Range

  As a logged-in user
  I want to adjust slider controls in the QA sandbox
  So that continuous, discrete, and range slider interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @slider-range @android
  Scenario: Opening Slider & Range displays all slider types with default values
    When the user opens Additional Tests
      And the user opens the Slider & Range scenario
    Then the slider and range screen should be displayed
      And the continuous slider should show value 50
      And the discrete slider should show value 3
      And the range slider should show values 20 to 80

  @regression @high @additional-tests @slider-range @android
  Scenario: Adjusting the continuous slider updates the displayed value
    When the user opens Additional Tests
      And the user opens the Slider & Range scenario
      And the user sets the continuous slider to 75
    Then the continuous slider should show value 75

  @regression @high @additional-tests @slider-range @android
  Scenario: Adjusting the discrete slider updates the displayed value
    When the user opens Additional Tests
      And the user opens the Slider & Range scenario
      And the user sets the discrete slider to 5
    Then the discrete slider should show value 5

  @regression @high @additional-tests @slider-range @android
  Scenario: Adjusting the range slider updates the min and max values
    When the user opens Additional Tests
      And the user opens the Slider & Range scenario
      And the user sets the range slider from 30 to 60
    Then the range slider should show values 30 to 60
