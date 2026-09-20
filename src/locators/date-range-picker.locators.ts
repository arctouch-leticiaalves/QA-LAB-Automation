export const DATE_RANGE_PICKER_LOCATORS = {
  dateRangePickerCard:
    'android=new UiSelector().descriptionContains("Date Range Picker")',

  pickRangeButton: '~Pick Range',

  nextMonthButton: '~Next month',

  saveButton: '~Save',

  calendarDay: (accessibleDate: string) =>
    `android=new UiSelector().description("${accessibleDate}")`,

  selectedRange: (start: string, end: string) =>
    `android=new UiSelector().descriptionContains("Selected range: ${start} to ${end}")`,
} as const
