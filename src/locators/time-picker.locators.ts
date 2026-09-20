export const TIME_PICKERS_LOCATORS = {
  pickTimeButton: '~Pick Time',
  switchToTextInput: '~Switch to text input mode',
  enterTimeLabel: '~Enter time',
  hourInput:
    'android=new UiSelector().className("android.widget.EditText").instance(0)',
  minuteInput:
    'android=new UiSelector().className("android.widget.EditText").instance(1)',
  amButton: '~AM',
  pmButton: '~PM',
  confirmButton: '~OK',
  selectedTime: (time: string) =>
    `android=new UiSelector().descriptionContains("Selected time: ${time}")`,
} as const
