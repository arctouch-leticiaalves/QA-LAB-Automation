export const PROFILE_LOCATORS = {
  profileTab: 'android=new UiSelector().descriptionContains("Tab 3 of 4")',

  backButton: '~Back',

  // "Edit Profile" appears as the app-bar title on the edit screen.
  editProfileTitle: 'android=new UiSelector().description("Edit Profile").clickable(false)',

  // Top app-bar action and bottom CTA both save the form.
  saveButton: 'android=new UiSelector().description("Save").clickable(true)',
  saveChangesButton: '~Save Changes',

  fullNameField: '//android.widget.EditText[starts-with(@hint, "Name input field")]',
  emailField: '//android.widget.EditText[starts-with(@hint, "Email input field")]',
  phoneField: '//android.widget.EditText[starts-with(@hint, "Phone input field")]',
  addressField: '//android.widget.EditText[starts-with(@hint, "Address input field")]',
  cityField: '//android.widget.EditText[starts-with(@hint, "City input field")]',
  stateField: '//android.widget.EditText[starts-with(@hint, "State input field")]',
  zipCodeField: '//android.widget.EditText[starts-with(@hint, "ZIP code input field")]',

  // Inline field validation errors (android.view.View with live-region="1" inside each EditText)
  fieldError: '//android.view.View[@live-region="1"]',

  // Required markers shown under Full Name and Email when validation fails.
  requiredIndicator: '~Required',

  // Inline email format validation error.
  invalidEmailError: '~Invalid email',

  // Discard confirmation dialog (shown when navigating back with unsaved changes).
  discardDialogTitle: '~Discard changes?',
  discardDialogMessage:
    'android=new UiSelector().descriptionContains("unsaved changes")',
  discardDialogCancelButton: '~Cancel',
  discardDialogDiscardButton: '~Discard',

  // Profile screen (parent of edit profile).
  profileTitle: 'android=new UiSelector().description("Profile").clickable(false)',
  editProfileButton:
    'android=new UiSelector().descriptionContains("Edit profile button")',

  // Toast/snackbar shown after a successful profile save.
  successToast: 'android=new UiSelector().descriptionContains("Profile updated")',
} as const
