export const DIALOG_WITH_INPUT_LOCATORS = {
  dialogWithInputTitle:
    'android=new UiSelector().description("Dialog with Input").clickable(false)',

  openTextDialogButton: '~Open Text Dialog',
  openFeedbackDialogButton: '~Open Feedback Dialog',
  openConfirmDialogButton: '~Open Confirm Dialog',

  textDialogTitle:
    'android=new UiSelector().descriptionContains("Enter Your Name")',

  nameInput:
    '//android.widget.EditText[contains(@hint, "Name input in dialog")]',

  // Clickable sibling under the "Submit name" label.
  submitButton:
    'android=new UiSelector().className("android.widget.Button").description("Submit").clickable(true)',

  cancelButton:
    'android=new UiSelector().className("android.widget.Button").description("Cancel").clickable(true)',

  submittedName: (name: string) =>
    `android=new UiSelector().descriptionContains("Name: ${name}")`,
} as const
