Feature: Dialog with Input

  As a logged-in user
  I want to submit values through dialogs in the QA sandbox
  So that dialog input interactions can be validated

  Background:
    Given the user is on the settings screen

  @smoke @critical @additional-tests @dialog-input @android
  Scenario: Opening Dialog with Input shows the dialog actions
    When the user opens Additional Tests
      And the user opens the Dialog with Input scenario
    Then the dialog with input screen should be displayed

  @regression @high @additional-tests @dialog-input @android
  Scenario: Submitting a name in the text dialog shows the result
    When the user opens Additional Tests
      And the user opens the Dialog with Input scenario
      And the user opens the text input dialog
      And the user submits the name QAUser in the text dialog
    Then the submitted name QAUser should be displayed
