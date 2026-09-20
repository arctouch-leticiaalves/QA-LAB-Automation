export const DROPDOWN_MENUS_LOCATORS = {
  dropdownMenusTitle:
    'android=new UiSelector().description("Dropdown Menus").clickable(false)',

  countryDropdown:
    'android=new UiSelector().descriptionContains("Country dropdown")',

  countryDropdownNoneSelected:
    'android=new UiSelector().descriptionContains("Country dropdown, none selected")',

  countryOption: (country: string) =>
    `android=new UiSelector().description("${country}")`,

  countryDropdownSelected: (country: string) =>
    `android=new UiSelector().descriptionContains("Country dropdown, ${country}")`,

  sortPopup:
    'android=new UiSelector().descriptionContains("Sort options popup menu")',

  sortPopupNoneSelected:
    'android=new UiSelector().descriptionContains("No sort selected")',

  sortOption: (option: string) =>
    `android=new UiSelector().descriptionContains("Sort by ${option}")`,

  sortPopupSelected: (option: string) =>
    `android=new UiSelector().descriptionContains("${option}")`,

  countryAutocomplete:
    '//android.widget.EditText[contains(@hint, "Search country autocomplete")]',

  countryAutocompleteNoneSelected:
    '//android.widget.EditText[contains(@hint, "Search Country") and not(contains(@hint, "Selected:"))]',

  countryAutocompleteSelected: (country: string) =>
    `//android.widget.EditText[contains(@hint, "Selected: ${country}")]`,

  autocompleteSuggestion: (country: string) => `~${country}`,
} as const
