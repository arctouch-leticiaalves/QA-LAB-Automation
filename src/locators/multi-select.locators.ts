export const MULTI_SELECT_LOCATORS = {
  multiSelectTitle:
    'android=new UiSelector().description("Multi-Select").clickable(false)',

  item: (name: string) =>
    `android=new UiSelector().description("${name}").clickable(true)`,

  itemSelected: (name: string) =>
    `android=new UiSelector().descriptionContains("${name}, selected")`,

  itemNotSelected: (name: string) =>
    `android=new UiSelector().descriptionContains("${name}, not selected")`,

  selectAllButton: '~Select All',
  deselectAllButton: '~Deselect All',
  deleteButton: '~Delete',

  // Footer counter, e.g. "Selected count: 0\n0 selected"
  selectedCountLabel:
    'android=new UiSelector().descriptionContains("Selected count:")',

  noItemsRemaining:
    'android=new UiSelector().descriptionContains("No items remaining")',
} as const

export const MULTI_SELECT_ITEMS = {
  annualReport: 'Annual Report.pdf',
  budget: 'Budget_2026.xlsx',
  meetingNotes: 'Meeting Notes.docx',
} as const
