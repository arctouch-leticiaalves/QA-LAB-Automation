Feature: OTP / PIN Input

  As a logged-in user
  I want to enter and verify a one-time PIN in the QA sandbox
  So that OTP input and verification can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @otp @android
  Scenario: Opening OTP / PIN Input shows the verification fields
    When the user opens Additional Tests
      And the user opens the OTP / PIN Input scenario
    Then the OTP / PIN Input screen should be displayed
      And the OTP digit fields should be displayed

  @regression @high @additional-tests @otp @android
  Scenario: Verifying an invalid OTP shows an error
    When the user opens Additional Tests
      And the user opens the OTP / PIN Input scenario
      And the user enters the OTP code 000000
      And the user verifies the OTP code
    Then the invalid OTP message should be displayed

  @regression @high @additional-tests @otp @android
  Scenario: Clearing the OTP removes the entered code and error
    When the user opens Additional Tests
      And the user opens the OTP / PIN Input scenario
      And the user enters the OTP code 000000
      And the user verifies the OTP code
      And the user clears the OTP code
    Then the invalid OTP message should not be displayed

  @regression @critical @additional-tests @otp @android
  Scenario: Verifying the correct OTP shows success
    When the user opens Additional Tests
      And the user opens the OTP / PIN Input scenario
      And the user enters the OTP code 123456
      And the user verifies the OTP code
    Then the OTP verification success message should be displayed
