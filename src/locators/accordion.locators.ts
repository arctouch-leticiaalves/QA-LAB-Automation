export const ACCORDION_LOCATORS = {
  accordionTitle:
    'android=new UiSelector().description("Accordion").clickable(false)',

  expandAllButton: '~Expand All',
  collapseAllButton: '~Collapse All',

  expandedCount: (count: number, total = 5) =>
    `android=new UiSelector().descriptionContains("${count} of ${total} sections expanded")`,

  sectionHeader: (title: string, state: 'Collapsed' | 'Expanded') =>
    `android=new UiSelector().description("${title}, ${state}")`,

  whatIsThisAppContent:
    'android=new UiSelector().descriptionContains("QA training application built by ArcTouch")',
} as const

export const ACCORDION_SECTIONS = {
  whatIsThisApp: 'What is this app?',
  technologyStack: 'Technology Stack',
  automationTips: 'Automation Tips',
  testCredentials: 'Test Credentials',
  knownLimitations: 'Known Limitations',
} as const
