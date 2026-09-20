export const TAB_BAR_LOCATORS = {
  tabBarTitle:
    'android=new UiSelector().description("Tab Bar").clickable(false)',

  tabByIndex: (index: number, total = 4) =>
    `android=new UiSelector().descriptionContains("Tab ${index} of ${total}").clickable(true)`,

  activeTab: (index: number, total = 4) =>
    `android=new UiSelector().descriptionContains("Active tab: ${index} of ${total}")`,

  tabContent: (name: string) =>
    `android=new UiSelector().descriptionContains("${name} tab content")`,
} as const

export const TAB_BAR_TABS = {
  home: { name: 'Home', index: 1 },
  explore: { name: 'Explore', index: 2 },
  saved: { name: 'Saved', index: 3 },
  account: { name: 'Account', index: 4 },
} as const
