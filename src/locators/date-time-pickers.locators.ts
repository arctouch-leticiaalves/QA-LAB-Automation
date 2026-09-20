export const DATE_TIME_PICKERS_LOCATORS = {
  dateTimePickersTitle:
    'android=new UiSelector().description("Date & Time Pickers").clickable(false)',

  datePickerCard: 'android=new UiSelector().descriptionContains("Date Picker")',

  pickDateButton: '~Pick Date',

  nextMonthButton: '~Next month',

  confirmButton: '~OK',

  calendarDay: (accessibleDate: string) =>
    `android=new UiSelector().description("${accessibleDate}")`,

  selectedDate: (formattedDate: string) =>
    `android=new UiSelector().descriptionContains("Selected date: ${formattedDate}")`,
} as const
